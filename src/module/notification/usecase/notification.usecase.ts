import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../domain/model/notification.entity';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class NotificationUsecase {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  async createNotification(userId: string, title: string, message: string, referenceId: string) {
    const notification = this.notificationRepository.create({
      userId,
      title,
      message,
      referenceId,
      type: NotificationType.ORDER_UPDATE,
    });

    const saved = await this.notificationRepository.save(notification);

    // Publish real-time event
    this.pubSub.publish('notificationReceived', { notificationReceived: saved });

    return saved;
  }
}
