import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayload } from 'jose';

export const TokenPayload = createParamDecorator<JWTPayload>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['tokenPayload'];
  },
);
