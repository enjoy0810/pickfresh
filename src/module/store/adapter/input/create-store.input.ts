import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressInput } from '../../../../framework/shared/domain/address.model';

@InputType()
export class CreateStoreInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  ownerFullName!: string;

  @Field(() => AddressInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressInput)
  address?: AddressInput;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
