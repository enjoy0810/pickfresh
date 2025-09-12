import { Field, ID, Int, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDate,
  IsEmail,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressInput } from '../../../../framework/shared/domain/address.model';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;

  // Basic info
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  // Contact info
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Main address
  @Field(() => AddressInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInput)
  address?: AddressInput;

  // User type
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userType?: string;

  // Seller-specific
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  storeName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  storeOwnerFullName?: string;

  @Field(() => AddressInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInput)
  storeAddress?: AddressInput;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  storeDescription?: string;

  // Stripe / transactions
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  stripeAccountId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  transactionCount?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  balance?: number;

  // Firebase UID
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firebaseUid?: string;
}
