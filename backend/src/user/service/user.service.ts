import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(code: string) {
    // via API 42.
    const responseToken = await this.httpService.axiosRef.post(
      'https://api.intra.42.fr/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('API42_CLIENT_ID'),
        client_secret: this.configService.get<string>('API42_CLIENT_SECRET'),
        redirect_uri: 'http://localhost:3000/user/register',
        code,
      },
    );
    return responseToken.data;
  }
}
