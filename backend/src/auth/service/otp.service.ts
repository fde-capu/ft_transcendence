import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class OtpService {
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  verify(token: string, secret: string): boolean {
    return authenticator.check(token, secret);
  }

  getUri(account: string, secret: string): string {
    return authenticator.keyuri(account, 'ft_transcendence', secret);
  }

  getToken(secret: string): string {
    return authenticator.generate(secret);
  }
}
