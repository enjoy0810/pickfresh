import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address, AddressEmbeddable } from '../../../../framework/shared/domain/address.model';
import { PickupSchedule } from '../../../../framework/shared/domain/pickup-schedule.model';

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true })
  photos?: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  seller?: string;

  @Field(() => Address, { nullable: true })
  @Column('json', { nullable: true })
  address?: AddressEmbeddable;

  @Field()
  @Column('numeric', { precision: 10, scale: 2, default: 0}) // allows up to 99999999.99
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  unit?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bagsAvailable?: number;

  @Field(() => PickupSchedule, { nullable: true })
  @Column('jsonb', { nullable: true })
  pickupSchedule?: PickupSchedule;

  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  subCategory?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  variety?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

}
