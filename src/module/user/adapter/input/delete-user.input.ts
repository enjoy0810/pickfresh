import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;
} 