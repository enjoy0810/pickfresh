import { InputType, Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class PaymentIntentInput {
  @Field(() => Float) // 👈 changed from Int
  @IsNumber()
  @Min(0.01)
  amount: number; // e.g. 2.99 dollars

  @Field()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  sellerId: string; 
}