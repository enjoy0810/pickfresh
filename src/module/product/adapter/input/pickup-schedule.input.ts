import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PickupScheduleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  date: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  repeat: string;
}
