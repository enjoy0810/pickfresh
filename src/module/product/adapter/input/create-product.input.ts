import { Field, InputType, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GraphQLUpload } from 'graphql-upload';
import { AddressInput } from '../../../../framework/shared/domain/address.model';
import { PickupScheduleInput } from './pickup-schedule.input';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  subCategory: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field()
  @IsOptional()
  @IsString()
  variety: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => [GraphQLUpload])
  @ArrayMaxSize(3)
  photos: Promise<any>[]; // <-- this is how you're using it, and it's valid

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber({ allowNaN: false }, { message: 'Price must be a valid number' })
  @Min(0)
  price: number; // in dollars

  @Field()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  unit: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  size: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  bagsAvailable?: number;

  @Field()
  // @IsNotEmpty()
  @IsString()
  seller: string;

  @Field(() => AddressInput, { nullable: true })
  @ValidateNested()
  @Type(() => AddressInput)
  address?: AddressInput;

  @Field(() => PickupScheduleInput)
  @ValidateNested()
  @Type(() => PickupScheduleInput)
  pickupSchedule: PickupScheduleInput;
}
