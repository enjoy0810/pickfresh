import { Resolver, Query, Args, Subscription } from '@nestjs/graphql';
import { Notification } from '../../domain/model/notification.entity';
import { NotificationUsecase } from '../../usecase/notification.usecase';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationUsecase: NotificationUsecase,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Notification])
  async notifications(@Args('userId') userId: string): Promise<Notification[]> {
    return this.notificationUsecase['notificationRepository'].find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  @Subscription(() => Notification, {
    filter: (payload, variables) =>
      payload.notificationReceived.userId === variables.userId,
  })
  notificationReceived(@Args('userId') userId: string) {
    return (this.pubSub as any).asyncIterator('notificationReceived'); // FIX
  }

}
