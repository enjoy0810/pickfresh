import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;
}
