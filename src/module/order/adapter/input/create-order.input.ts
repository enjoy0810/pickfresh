import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateOrderItemInput {
  @Field()
  @IsUUID()
  productId: string;

  @Field(() => Int)
  @IsInt()
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  @IsUUID()
  sellerId: string;

  @Field(() => [CreateOrderItemInput])
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemInput)
  @ArrayMinSize(1)
  items: CreateOrderItemInput[];
}
