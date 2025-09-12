import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Address, AddressEmbeddable } from '../../../../framework/shared/domain/address.model';

@ObjectType()
@Entity()
export class Store {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Field()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  ownerId!: string;

  @Field()
  @Column({ type: 'varchar', length: 160 })
  ownerFullName!: string;

  @Field(() => Address, { nullable: true })
  @Column(() => AddressEmbeddable, { prefix: false })
  address?: Address;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
