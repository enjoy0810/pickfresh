import { Field, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

@ObjectType()
export class UserInfo {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  middleName?: string;

  @Field()
  dateOfBirth: Date;

  @Field({ nullable: true })
  gender?: string;

  constructor(userInfo: Partial<UserInfo>) {
    Object.assign(this, userInfo);
  }
}

@InputType()
export class UserInfoInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  middleName?: string;

  @Field()
  @IsNotEmpty()
  dateOfBirth: Date;

  @Field()
  @IsNotEmpty()
  gender: string;
} 