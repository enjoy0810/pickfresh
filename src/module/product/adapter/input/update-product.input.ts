import { Field, InputType, Float, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GraphQLUpload } from 'graphql-upload';
import { AddressInput } from '../../../../framework/shared/domain/address.model';
import { PickupScheduleInput } from './pickup-schedule.input';


@InputType()
export class UpdateProductInput {
  // @Field(() => ID)
  // id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variety?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  @ArrayMaxSize(3)
  photos?: Promise<any>[];

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ allowNaN: false }, { message: 'Price must be a valid number' })
  @Min(0)
  price: number; // in dollars

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unit?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  size?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  bagsAvailable?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  seller?: string;

  @Field(() => AddressInput, { nullable: true })
  @ValidateNested()
  @Type(() => AddressInput)
  address?: AddressInput;

  @Field(() => PickupScheduleInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => PickupScheduleInput)
  pickupSchedule?: PickupScheduleInput;
}
