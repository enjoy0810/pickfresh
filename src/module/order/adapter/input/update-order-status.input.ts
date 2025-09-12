import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, IsEnum } from 'class-validator';
import { OrderStatus } from '../../domain/model/order.entity';

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  @IsUUID()
  orderId: string;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
