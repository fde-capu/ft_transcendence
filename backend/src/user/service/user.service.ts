import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TokenDTO {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface MeDTO {
  login: string;
  email: string;
  displayname: string;
  image: { versions: { micro: string; }}
}

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getToken(code: string): Promise<TokenDTO>
  {
    const responseToken = await this.httpService.axiosRef.post<TokenDTO>(
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

  async getMe({ access_token }: TokenDTO): Promise<MeDTO> {
    const response = await this.httpService.axiosRef.get<MeDTO>(
      'https://api.intra.42.fr/v2/me',
      { headers: { Authorization: `Bearer ${access_token}` } },
    );
	console.log("getMe response:", response);
    return response.data;
  }
}
