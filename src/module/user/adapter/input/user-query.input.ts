import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UserQueryInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;
} 