import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/domain/model/user.entity.typeorm';
import { IUserUsecase, USER_USECASE } from '../../user/usecase/interface/user.usecase.interface';
import { PaymentIntentInput } from '../domain/stripe.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject(USER_USECASE) private readonly userUsecase: IUserUsecase,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const stripeApiVersion = process.env.STRIPE_API_VERSION;

    if (!stripeSecret) {
      throw new Error('STRIPE_SECRET_KEY env variable is missing');
    }
    if (!stripeApiVersion) {
      throw new Error('STRIPE_API_VERSION env variable is missing');
    }

    this.stripe = new Stripe(stripeSecret, {
      apiVersion: stripeApiVersion as Stripe.StripeConfig['apiVersion'],
    });
  }

  private calculateFee(amount: number, transactionCount: number): number {
    const FREE_LIMIT = 15;
    const FEE_PERCENT = 0.05;
    if (transactionCount < FREE_LIMIT) return 0;
    return Math.floor(amount * FEE_PERCENT);
  }

  async resetStripeAccount(sellerId: string): Promise<boolean> {
    const seller = await this.userRepository.findOneBy({ id: sellerId });
    if (!seller) throw new NotFoundException('Seller not found');

    seller.stripeAccountId = undefined;
    await this.userUsecase.update(seller.id, {
      stripeAccountId: undefined,
    });

    return true;
  }


  private async ensureStripePayoutReady(seller: UserEntity): Promise<void> {
    if (!seller.stripeAccountId || seller.stripeAccountId == '') {
      console.log('already stripeaccountid');

      const account = await this.stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: seller.email,
        capabilities: {
          transfers: { requested: true },
        },
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: '127.0.0.1',
        },
        business_type: 'individual',
        business_profile: {
          product_description: 'Food pick platform seller',
        },
        individual: {
          first_name: seller.firstName || 'Jenny',
          last_name: seller.lastName || 'Rosen',
          email: seller.email,
          dob: {
            day: 1,
            month: 1,
            year: 1990,
          },
          address: {
            line1: '123 Test St',
            city: 'Testville',
            state: 'CA',
            postal_code: '94111',
            country: 'US',
          },
          ssn_last_4: '0000',
        },
      });

      seller.stripeAccountId = account.id;
      await this.userUsecase.update(seller.id, {
        stripeAccountId: account.id,
      });

      // Wait for Stripe to activate capabilities (simulate delay)
      await new Promise((res) => setTimeout(res, 2000));
    }

    // Re-fetch account after creation
    const updatedAccount = await this.stripe.accounts.retrieve(seller.stripeAccountId);
    const capability = updatedAccount.capabilities?.transfers;

    if (capability !== 'active') {
      throw new ForbiddenException('Stripe account is not fully onboarded for transfers');
    }
  }

  async addBankAccount(sellerId: string, bankInfo: {
    account_number: string;
    routing_number: string;
    account_holder_name: string;
    account_holder_type: 'individual' | 'company';
    country?: string;
    currency?: string;
  }): Promise<void> {

    // await this.userRepository.update(sellerId, {
    //   stripeAccountId: '',
    // });



    const seller = await this.userRepository.findOneBy({ id: sellerId });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    await this.ensureStripePayoutReady(seller);

    await this.stripe.accounts.createExternalAccount(seller.stripeAccountId!, {
      external_account: {
        object: 'bank_account',
        country: bankInfo.country || 'US',
        currency: bankInfo.currency || 'usd',
        routing_number: bankInfo.routing_number,
        account_number: bankInfo.account_number,
        account_holder_name: bankInfo.account_holder_name,
        account_holder_type: bankInfo.account_holder_type,
      },
    });
  }

  async createPaymentIntent(input: PaymentIntentInput): Promise<string> {
    const seller = await this.userRepository.findOneBy({ id: input.sellerId });
    if (!seller) throw new NotFoundException('seller not found');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: input.amount, // cent
      currency: input.currency,
      payment_method_types: ['card'],
      metadata: {
        sellerId: seller.id,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('Stripe did not return a client_secret');
    }

    const feeAmount = this.calculateFee(input.amount, seller.transactionCount ?? 0);

    seller.transactionCount = (seller.transactionCount ?? 0) + 1;
    const currentBalance = parseFloat(seller.balance ?? '0');
    const newBalance = currentBalance + (input.amount - feeAmount) / 100; // convert cent to usd
    seller.balance = newBalance.toFixed(2);

    await this.userUsecase.update(seller.id, {
      transactionCount: seller.transactionCount,
      balance: parseFloat(seller.balance),
    });

    return paymentIntent.client_secret;
  }

  async withdraw(sellerId: string, amount: number): Promise<string> {
    const seller = await this.userRepository.findOneBy({ id: sellerId });
    if (!seller) throw new NotFoundException('Seller not found');

    await this.ensureStripePayoutReady(seller);

    const currentBalance = parseFloat(seller.balance ?? '0') * 100; // convert usd to cent
    const withdrawAmount = amount ;
    if (withdrawAmount > currentBalance) {
      throw new ForbiddenException('Withdrawal amount exceeds available balance');
    }

    const transfer = await this.stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: seller.stripeAccountId!,
      metadata: {
        sellerId: seller.id,
        type: 'withdrawal',
      },
    });

    const newBalance = (currentBalance - withdrawAmount) / 100; // convert cent to usd
    seller.balance = newBalance.toFixed(2);
    await this.userUsecase.update(seller.id, {
      balance: parseFloat(seller.balance),
    });

    return transfer.id;
  }
}