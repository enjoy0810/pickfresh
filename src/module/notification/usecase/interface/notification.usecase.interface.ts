import { Notification } from '../../domain/model/notification.entity';

export interface INotificationUsecase {
  createNotification(userId: string, title: string, message: string, referenceId: string): Promise<Notification>;
}
