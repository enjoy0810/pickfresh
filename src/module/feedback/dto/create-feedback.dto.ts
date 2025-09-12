import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min, Max, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateFeedbackDto {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  pickupExperience: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  freshness: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  flavor: number;

  @Field({ nullable: true })
  @IsOptional()
  comment?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  sellerId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  productId?: string;
}
