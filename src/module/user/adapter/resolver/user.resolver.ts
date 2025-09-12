// src/module/user/adapter/user.resolver.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards, ForbiddenException } from '@nestjs/common';
import { User } from '../../domain/model/user.entity';
import { IUserUsecase, USER_USECASE } from '../../usecase/interface/user.usecase.interface';
import { 
  UpdateUserInput, 
  UserQueryInput,
  DeleteUserInput
} from '../input';
import { WithdrawInput } from '../input/withdraw.input';
import { AuthGuard } from '../../../../framework/guards/auth.guard';
import { CurrentUser, CurrentUserData } from '../../../../framework/decorator/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(USER_USECASE)
    private readonly userUsecase: IUserUsecase
  ) {}

  @Query(() => User, { nullable: true })
  async user(
    @Args('input') input: UserQueryInput
  ): Promise<User | null> {
    return this.userUsecase.findById(input.id);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuard)
  async profile(
    @CurrentUser() currentUser: CurrentUserData
  ): Promise<User | null> {
    return this.userUsecase.findById(currentUser.id);
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Args('input') input: UpdateUserInput,
  ): Promise<User | null> {
    const { id, ...rest } = input;

    const updateData: Partial<User> = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined)
    );

    return this.userUsecase.update(id, updateData);
  }

  @Mutation(() => User, { nullable: true })
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() currentUser: CurrentUserData
  ): Promise<User | null> {
    if (input.id !== currentUser.id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    const { id, ...rest } = input;
    const updateData: Partial<User> = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined)
    );

    return this.userUsecase.update(id, updateData);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async deleteUser(
    @Args('input') input: DeleteUserInput,
    @CurrentUser() currentUser: CurrentUserData
  ): Promise<boolean> {
    if (input.id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    
    return this.userUsecase.softDelete(input.id);
  }

  // ✅ Query balance
  @Query(() => Number)
  @UseGuards(AuthGuard)
  async getBalance(
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<number> {
    return this.userUsecase.getBalanceByEmail(currentUser.email);
  }

  // ✅ Withdraw to bank (Stripe)
  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async withdrawToBank(
    @Args('input') input: WithdrawInput,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<User> {
    return this.userUsecase.withdrawToBank(currentUser.id, input.amount);
  }
}
