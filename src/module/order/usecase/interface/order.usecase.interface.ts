import { Order } from '../../domain/model/order.entity';
import { CreateOrderInput, UpdateOrderStatusInput } from '../../adapter/input';

export interface IOrderUsecase {
  createOrder(buyerId: string, input: CreateOrderInput): Promise<Order>;
  getOrdersByBuyer(buyerId: string): Promise<Order[]>;
  getOrdersBySeller(sellerId: string): Promise<Order[]>;
  updateOrderStatus(input: UpdateOrderStatusInput): Promise<Order>;
}
