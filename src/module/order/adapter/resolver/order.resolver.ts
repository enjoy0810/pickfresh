import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Order } from '../../domain/model/order.entity';
import { OrderUsecase } from '../../usecase/order.usecase';
import { CreateOrderInput, UpdateOrderStatusInput } from '../input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderUsecase: OrderUsecase) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('buyerId', { type: () => String }) buyerId: string,
    @Args('input', { type: () => CreateOrderInput }) input: CreateOrderInput,
  ): Promise<Order> {
    return this.orderUsecase.createOrder(buyerId, input);
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('input') input: UpdateOrderStatusInput,
  ): Promise<Order> {
    return this.orderUsecase.updateOrderStatus(input);
  }

  @Query(() => [Order])
  async buyerOrders(@Args('buyerId') buyerId: string): Promise<Order[]> {
    return this.orderUsecase.getOrdersByBuyer(buyerId);
  }

  @Query(() => [Order])
  async sellerOrders(@Args('sellerId') sellerId: string): Promise<Order[]> {
    return this.orderUsecase.getOrdersBySeller(sellerId);
  }
 
  @Query(() => Order, { nullable: true })
  async orderById(@Args('orderId', { type: () => String }) orderId: string): Promise<Order | null> {
    return this.orderUsecase.getOrderById(orderId);
  }

}
