import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFortyTwoApi } from 'src/forty-two/service/user';
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
  login: string;
  mfa: { enabled: boolean, verified: boolean };
}



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async registerUser(codeFrom42: UserFortyTwoApi): Promise<registerResp> {
    const existUser = await this.userRepository.findOneBy({ login: codeFrom42.login });
    if (existUser === null)
      await this.userRepository.insert({ login: codeFrom42.login, email: codeFrom42.email });
    return ({ login: codeFrom42.login, mfa: { enabled: true, verified: false } });
  }
  
  async getUserByLogin(login: string) {
    const resp = await this.userRepository.findOneBy({ login });
    if (resp === null)
      throw new NotFoundException();
    return resp;
  }
}
