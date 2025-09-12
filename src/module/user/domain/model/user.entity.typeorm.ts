import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { AddressEmbeddable } from '../../../../framework/shared/domain/address.model';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string; // 'male' | 'female'

  @Column({ nullable: true })
  phoneNumber: string;

  // Main address
  @Column(() => AddressEmbeddable, { prefix: 'address' })
  address: AddressEmbeddable;

  // Firebase auth
  @Column({ nullable: true })
  firebaseUid?: string;

  // Stripe
  @Column({ nullable: true })
  stripeAccountId?: string;

  @Column({ type: 'int', default: 0 })
  transactionCount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: '0' })
  balance: string;

  // String user type
  @Column({ nullable: true })
  userType: string; // 'buyer', 'seller', etc.

  // Seller-specific fields
  @Column({ nullable: true })
  storeName?: string;

  @Column({ nullable: true })
  storeOwnerFullName?: string;

  @Column(() => AddressEmbeddable, { prefix: 'store' })
  storeAddress?: AddressEmbeddable;

  @Column({ nullable: true, type: 'text' })
  storeDescription?: string;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
