import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './domain/model/order.entity';
import { OrderItem } from './domain/model/order-item.entity';
import { ProductModule } from '../product/product.module';
import { User } from '../user/domain/model/user.entity'; // 👈 import User
import { OrderResolver } from './adapter/resolver/order.resolver';
import { OrderUsecase } from './usecase/order.usecase';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User]), // 👈 add User here
    NotificationModule,
    ProductModule
  ],
  providers: [OrderResolver, OrderUsecase],
  exports: [OrderUsecase],
})
export class OrderModule {}
