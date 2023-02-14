import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFortyTwoApi } from 'src/forty-two/service/user';
import { Repository } from 'typeorm';
import { Users } from '../entity/user.entity';

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
  image: { versions: { micro: string; } }
}
export interface registerResp {
  login?: string;
  mfa_enable?: boolean,
  mfa_verified?: boolean,
}



@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) { }

  // async register(codeFrom42: Users): Promise<Users> {
  //   const existUser = await this.userRepository.findOneBy({ login: codeFrom42.login });
  //   if (existUser === null){
  //     const createdUser =  this.userRepository.create({ login: codeFrom42.login, email: codeFrom42.email });
  //     return (await this.userRepository.save(createdUser));
  //   }
  //   await this.updateUser(codeFrom42.login, { mfa_enable: true,  mfa_verified: false });
  //   return ({ login: codeFrom42.login, mfa_enable: true,  mfa_verified: false });
  // }

  async registerUser(codeFrom42: UserFortyTwoApi): Promise<registerResp> {
    const existUser = await this.userRepository.findOneBy({ login: codeFrom42.login });
    if (existUser === null){
      const createdUser =  this.userRepository.create({ login: codeFrom42.login, email: codeFrom42.email });
      return (await this.userRepository.save(createdUser));
    }
    await this.updateUser(codeFrom42.login, { mfa_enable: true,  mfa_verified: false });
    //se os mfa forem sempre atualizados no banco de dados, poderiamos retornar oq recebemos do mesmo, na variavel 'existUser'
    return ({ login: existUser.login, mfa_enable: true,  mfa_verified: false }); 
  }
  
  async updateUser(login: string, user: Users){
    const resp = await this.userRepository.createQueryBuilder()
    .update(Users)
    .set(user)
    .where("login = :login", { login: login })
    .execute();
    if (resp.affected === 0){
      throw new NotFoundException();
    }
    return resp;
  }

  async getUserByLogin(login: string) {
    const resp = await this.userRepository.findOneBy({ login });
    if (resp === null)
      throw new NotFoundException();
    return resp;
  }
}
