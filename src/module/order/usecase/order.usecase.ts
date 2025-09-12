import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../domain/model/order.entity';
import { OrderItem } from '../domain/model/order-item.entity';
import { Product } from '../../product/domain/model/product.entity';
import { PRODUCT_REPOSITORY } from '../../product/usecase/interface/product.repository.interface';
import { IProductRepository } from '../../product/usecase/interface/product.repository.interface';
import { CreateOrderInput, UpdateOrderStatusInput } from '../adapter/input';
import { IOrderUsecase } from './interface/order.usecase.interface';
import { NotificationUsecase } from '../../notification/usecase/notification.usecase';

@Injectable()
export class OrderUsecase implements IOrderUsecase {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    
    private readonly notificationUsecase: NotificationUsecase,
  ) {}

  async createOrder(buyerId: string, input: CreateOrderInput): Promise<Order> {
    const { sellerId, items } = input;

    const productIds = items.map((i) => i.productId);
    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const orderItems = items.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) {
        throw new NotFoundException(`Product with id ${i.productId} not found`);
      }
      return this.orderItemRepository.create({
        product,
        price: product.price,
        quantity: i.quantity,
        totalPrice: product.price * i.quantity,
      });
    });

    const order = this.orderRepository.create({
      buyer: { id: buyerId },
      seller: { id: sellerId },
      status: OrderStatus.PENDING,
      items: orderItems,
    });

    return this.orderRepository.save(order);
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['buyer', 'seller', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['buyer', 'seller', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(input: UpdateOrderStatusInput): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: input.orderId },
      relations: ['buyer', 'seller', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    order.status = input.status;
    const savedOrder = await this.orderRepository.save(order);

    if (input.status === OrderStatus.COMPLETE) {
      for (const item of order.items) {
        const product = await this.productRepository.findById(item.product.id);

        if (product) {
          const currentQty = product.quantity ?? 0;
          const updatedProduct = await this.productRepository.update(product.id, {
            quantity: Math.max(0, currentQty - item.quantity),
          });

          console.log(updatedProduct)
        }
      }
    }

    // Notify Buyer
    await this.notificationUsecase.createNotification(
      order.buyer.id,
      'Order Status Updated',
      `Your order ${order.id} is now ${order.status}`,
      order.id,
    );

    // Notify Seller
    await this.notificationUsecase.createNotification(
      order.seller.id,
      'Order Status Updated',
      `Order ${order.id} is now ${order.status}`,
      order.id,
    );

    return savedOrder;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'buyer', 'seller'],
    });
  }

}
