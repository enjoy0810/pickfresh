import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../user/domain/model/user.entity';

@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field()
  expiresIn: number;
}

@ObjectType()
export class AuthResponse {
  @Field(() => AuthToken)
  auth: AuthToken;

  @Field(() => User)
  user: User;
}