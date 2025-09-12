import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './domain/model/notification.entity';
import { NotificationUsecase } from './usecase/notification.usecase';
import { NotificationResolver } from './adapter/resolver/notification.resolver';
import { PubSub } from 'graphql-subscriptions';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationUsecase,
    NotificationResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [NotificationUsecase, 'PUB_SUB'],
})
export class NotificationModule {}
