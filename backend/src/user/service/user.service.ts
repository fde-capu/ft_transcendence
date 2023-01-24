import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

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
  image: { versions: { micro: string } };
}
export interface registerResp {
  token: string;
  login: string;
}



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(codeFrom42: string = ''): Promise<registerResp>
  {
    if (!codeFrom42 || codeFrom42 === '')
      throw new BadRequestException();
    try{
      const responseToken = await this.httpService.axiosRef.post<string>(
        'https://api.intra.42.fr/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: this.configService.get<string>('API42_CLIENT_ID'),
          client_secret: this.configService.get<string>('API42_CLIENT_SECRET'),
          redirect_uri: 'http://localhost:3000/user/register',
          codeFrom42,
        },
      );
      const {login} = await this.getBasicUserInfo(responseToken.data);
      return ({token: responseToken.data, login});
    }
    catch(err){
      throw err.response;
    }
  }

  async getBasicUserInfo(access_token: string): Promise<MeDTO> {
    const response = await this.httpService.axiosRef.get<MeDTO>(
      'https://api.intra.42.fr/v2/me',
      { headers: { Authorization: `Bearer ${access_token}` } },
    );
    return response.data;
  }
}
