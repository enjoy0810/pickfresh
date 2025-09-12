import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

@ObjectType()
export class Address {
  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field()
  zipcode: string;

  constructor(address: Partial<Address>) {
    Object.assign(this, address);
  }
}

@InputType()
export class AddressInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  street: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  city: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  state: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  country: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  zipcode: string;
} 

export class AddressEmbeddable {
  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  zipcode?: string;
}