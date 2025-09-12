import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressInput } from '../../../../framework/shared/domain/address.model';

@InputType()
export class UpdateStoreInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  ownerFullName?: string;

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
