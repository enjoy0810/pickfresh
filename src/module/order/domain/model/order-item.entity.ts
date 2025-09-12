import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../../../product/domain/model/product.entity';
import { Order } from './order.entity';

@ObjectType()
@Entity('order_items')
export class OrderItem {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Field()
  @Column('numeric', { precision: 10, scale: 2, default: 0 }) // allows up to 99999999.99
  price: number;

  @Field(() => Int)
  @Column('int')
  quantity: number;

  @Field()
  @Column('numeric', { precision: 12, scale: 2, default: 0 }) // bigger for total
  totalPrice: number;
}
