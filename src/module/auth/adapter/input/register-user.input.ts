import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password too weak. Include at least one uppercase letter, one lowercase letter, one number, and one special character.'
  })
  password: string;
} 