import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTPayload, EncryptJWT, jwtDecrypt, base64url } from 'jose';

@Injectable()
export class TokenService {
  private secret: Uint8Array;

  constructor(readonly configService: ConfigService) {
    this.secret = base64url.decode(
      configService.get<string>('BACKEND_TOKEN_SECRET'),
    );
  }

  async sign(payload: JWTPayload): Promise<string> {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .encrypt(this.secret);
  }

  async inspect(jwt: string): Promise<JWTPayload> {
    const { payload } = await jwtDecrypt(jwt, this.secret);
    return payload;
  }
}
