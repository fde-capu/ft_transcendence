import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class TokenService {
  private readonly alg = 'HS256';

  private secret: Uint8Array;

  constructor(readonly configService: ConfigService) {
    this.secret = new TextEncoder().encode(
      configService.get<string>('BACKEND_TOKEN_SECRET'),
    );
  }

  async sign(subject: string, expiresIn = 7200): Promise<string> {
    return await new SignJWT({
      sub: subject,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    }).sign(this.secret);
  }

  async inspect(jwt: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(jwt, this.secret);
    return payload;
  }
}
