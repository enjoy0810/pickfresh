import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../../product/domain/model/product.entity';
import { UserEntity } from '../../../user/domain/model/user.entity.typeorm';

@ObjectType() // 👈 required for GraphQL
@Entity('feedbacks')
export class Feedback {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  pickupExperience: number; // 1–5

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  freshness: number; // 1–5

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  flavor: number; // 1–5

  @Field(() => String, { nullable: true })   // ✅ fix: explicit GraphQL type
  @Column({ type: 'text', nullable: true })
  comment?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  productId?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  sellerId?: string | null;

  // @ManyToOne(() => Product, (p) => p.id, { nullable: true })
  // product?: Product;

  @ManyToOne(() => UserEntity, (u) => u.id, { nullable: true })
  seller?: UserEntity;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;
}
