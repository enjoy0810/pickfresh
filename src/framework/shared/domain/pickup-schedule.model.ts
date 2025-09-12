import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PickupSchedule {
  @Field() date: string;

  @Field() startTime: string;

  @Field() endTime: string;

  @Field() repeat: string;
}
