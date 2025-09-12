// src/module/user/adapter/input/withdraw.input.ts

import { InputType, Field, Float } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class WithdrawInput {
  @Field(() => Float)
  @Min(1, { message: 'Withdraw amount must be at least 1' })
  amount: number;
}
