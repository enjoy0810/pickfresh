import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  ORDER_UPDATE = 'order_update',
}

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  message: string;

  @Field()
  @Column()
  referenceId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
