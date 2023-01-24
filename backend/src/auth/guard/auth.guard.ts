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
    if (!payload) throw new UnauthorizedException();
    return true;
  }
}
