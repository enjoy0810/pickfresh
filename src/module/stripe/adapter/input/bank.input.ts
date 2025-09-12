import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsIn } from 'class-validator';

@InputType()
export class BankInput {
  @Field()
  @IsString()
  account_number: string;

  @Field()
  @IsString()
  routing_number: string;

  @Field()
  @IsString()
  account_holder_name: string;

  @Field()
  @IsIn(['individual', 'company'])
  account_holder_type: 'individual' | 'company';

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;
}
