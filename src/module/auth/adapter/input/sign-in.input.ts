import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
} 