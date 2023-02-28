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

export interface UserDTO {
  intraId: string;
  name: string;
  image: string;
  score?: number;
}
export interface registerResp {
  intraId?: string;
  mfa_enable?: boolean,
  mfa_verified?: boolean,
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) { }

  // async register(codeFrom42: Users): Promise<Users> {
  //   const existUser = await this.userRepository.findOneBy({ intraId: codeFrom42.login });
  //   if (existUser === null){
  //     const createdUser =  this.userRepository.create({ intraId: codeFrom42.login, email: codeFrom42.email });
  //     return (await this.userRepository.save(createdUser));
  //   }
  //   await this.updateUser(codeFrom42.login, { mfa_enable: true,  mfa_verified: false });
  //   return ({ intraId: codeFrom42.login, mfa_enable: true,  mfa_verified: false });
  // }

  async registerUserOk42(codeFrom42: UserFortyTwoApi): Promise<registerResp> {
    let existUser = await this.userRepository.findOneBy({ intraId: codeFrom42.login });
    if (existUser === null){
		// console.log(codeFrom42); // The big reply from 42API.
      const createdUser =  this.userRepository.create({
		intraId: codeFrom42.login,
		email: codeFrom42.email,
		name: codeFrom42.displayname,
		image: codeFrom42.image['micro'],
		score: 0
	  });
      existUser = await this.userRepository.save(createdUser);
    }
	await this.updateUser(existUser.intraId, { mfa_verified: false });
	// Como este se trata do "OK da 42", apenas sempre desverificar só o mfa.
	// Aliás pode desimplementar o registro do mfa_verified na db.
    return ({ intraId: existUser.intraId, mfa_enable: existUser.mfa_enable,  mfa_verified: false }); 
  }
  
  async updateUser(intraId: string, user: Users){
    const resp = await this.userRepository.createQueryBuilder()
    .update(Users)
    .set(user)
    .where("intraId = :intraId", { intraId: intraId })
    .execute();
    if (resp.affected === 0){
      throw new NotFoundException();
    }
    return resp;
  }

  async getUserByIntraId(u_intraId: string): Promise<UserDTO> {
    const resp = await this.userRepository.findOneBy({ intraId: u_intraId });
    if (resp === null)
	{
//      throw new NotFoundException();
		console.log("Could not find", u_intraId, "returning undefined.");
		return undefined;
	}
	const dto: UserDTO = {
		intraId: resp.intraId,
		name: resp.name,
		image: resp.image,
		score: resp.score
	};
    return dto;
  }
}
