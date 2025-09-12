import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaymentIntentInput {
  @Field(() => Int)
  amount: number;

  @Field()
  currency: string;

  @Field()
  sellerId: string;
}