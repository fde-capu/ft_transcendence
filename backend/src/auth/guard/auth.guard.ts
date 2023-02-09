import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const payload = context.switchToHttp().getRequest()['tokenPayload'];
    if (!payload || (payload['mfa']['enabled'] && !payload['mfa']['verified']))
      throw new UnauthorizedException();
    return true;
  }
}
// CRN: Since this function is a service to know about authentication,
// would not it be better to return false @ line 13? I mean,
// the caller would throw the exception.
