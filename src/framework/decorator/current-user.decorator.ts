import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserData {
  id: string;
  email: string;
  type: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUserData => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.user;
  },
); 