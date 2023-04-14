import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const payload = request['tokenPayload'];

    if (!payload || (payload['mfa']['enabled'] && !payload['mfa']['verified'])) {
      throw new UnauthorizedException();
    }

    Object.assign(request, { user: payload }); 

    return true;
  }
}