import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { StripeService } from '../../usecase/stripe.service';
import { BankInput } from '../input/bank.input';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => String)
  async createPaymentIntent(
    @Args('amount') amount: number,
    @Args('currency') currency: string,
    @Args('sellerId') sellerId: string,
  ): Promise<string> {
    return this.stripeService.createPaymentIntent({ amount, currency, sellerId });
  }

  @Mutation(() => Boolean)
  async addBankAccount(
    @Args('sellerId') sellerId: string,
    @Args('bankInfo') bankInfo: BankInput,
  ): Promise<boolean> {
    await this.stripeService.addBankAccount(sellerId, bankInfo);
    return true;
  }

  @Mutation(() => Boolean)
  async withdraw(
    @Args('sellerId') sellerId: string,
    @Args('amount', { type: () => Int }) amount: number,
  ): Promise<boolean> {
    await this.stripeService.withdraw(sellerId, amount);
    return true;
  }

  @Mutation(() => Boolean)
  async resetStripeAccount(
    @Args('sellerId') sellerId: string,
  ): Promise<boolean> {
    return this.stripeService.resetStripeAccount(sellerId);
  }

}
