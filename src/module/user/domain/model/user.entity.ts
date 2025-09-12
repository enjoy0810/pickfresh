import { Field, ID, Int, Float, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Address } from '../../../../framework/shared/domain/address.model';

@ObjectType()
@Entity('users')  // 👈 important
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid') // 👈 important
  id: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;  

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  gender: string;

  // You’ll need to decide how to persist Address — embed/JSON/rel
  @Field(() => Address, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  address?: Address;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userType: string; // 'buyer', 'seller', etc.

  @Field({ nullable: true })
  @Column({ nullable: true })
  storeName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  storeOwnerFullName?: string;

  @Field(() => Address, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  storeAddress?: Address;

  @Field({ nullable: true })
  @Column({ nullable: true })
  storeDescription?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  stripeAccountId?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  transactionCount?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  balance?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firebaseUid?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;
}
