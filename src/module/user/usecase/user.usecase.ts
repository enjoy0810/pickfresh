import { Injectable, Inject, BadRequestException, forwardRef } from '@nestjs/common';
import { User } from '../domain/model/user.entity';
import { IUserRepository, USER_REPOSITORY } from './interface/user.repository.interface';
import { IUserUsecase } from './interface/user.usecase.interface';
import { StripeService } from '../../stripe/usecase/stripe.service';

@Injectable()
export class UserUsecase implements IUserUsecase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(forwardRef(() => StripeService)) // ✅ add forwardRef
    private readonly stripeService: StripeService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findByFirebaseUid(firebaseUid);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }
    return this.userRepository.update(id, updateData);
  }

  async softDelete(id: string): Promise<boolean> {
    return this.userRepository.softDelete(id);
  }

  // ✅ Get balance
  async getBalance(userId: string): Promise<number> {
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException('User not found');
    return user.balance ?? 0;
  }

  // ✅ Withdraw to Bank (deduct + Stripe payout)
  async withdrawToBank(userId: string, amount: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException('User not found');
    if (!user.stripeAccountId) {
      throw new BadRequestException('Stripe account not linked');
    }

    if ((user.balance ?? 0) < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const newBalance = (user.balance ?? 0) - amount;
    await this.userRepository.update(userId, { balance: newBalance });

    // call Stripe withdraw (your existing stripe.service.ts implementation)
    await this.stripeService.withdraw(user.stripeAccountId, amount);

    return (await this.findById(userId)) as User;
  }

  async getBalanceByEmail(email: string): Promise<number> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    return user.balance ?? 0;
  }

}
