import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFortyTwoApi } from 'src/forty-two/service/user';
import { Repository } from 'typeorm';
import { Users, UserDTO, StatisticsDTO } from '../entity/user.entity';
import { GameHistory } from '../../game/game-record';

export interface TokenDTO {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface registerResp {
  intraId?: string;
  mfa_enabled?: boolean;
  mfa_verified?: boolean;
}

@Injectable()
export class UserService {
  public static status: Map<string, string> = new Map<string, string>;
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
	@InjectRepository(GameHistory) private readonly historyRepository: Repository<GameHistory>,
  ) {}

  async registerUserOk42(codeFrom42: UserFortyTwoApi): Promise<registerResp> {
    let existUser = await this.userRepository.findOneBy({ intraId: codeFrom42.login });
    if (existUser === null){
		//console.log(codeFrom42); // The big reply from 42API.
      const createdUser =  this.userRepository.create({
		intraId: codeFrom42.login,
		email: codeFrom42.email,
		name: codeFrom42.displayname,
		image: codeFrom42.image['micro'],
		friends: [],
		blocks: [],
		score: 0,
		matches : 0,
		wins : 0,
		goalsMade : 0,
		goalsTaken : 0,
	  });
      existUser = await this.userRepository.save(createdUser);
    }

	await this.updateUser(existUser.intraId, { mfa_verified: false });
	// Como este se trata do "OK da 42", apenas sempre desverificar só o mfa.
	// Aliás pode desimplementar o registro do mfa_verified na db.
    return ({ intraId: existUser.intraId, mfa_enabled: existUser.mfa_enabled,  mfa_verified: false }); 
  }
  
  async updateUser(intraId: string, user: Users){
	let filtered_user = {
		name: user.name,
		image: user.image,
		friends: user.friends,
		blocks: user.blocks,
		score: user.score,
		matches : user.matches,
		wins : user.wins,
		goalsMade : user.goalsMade,
		goalsTaken : user.goalsTaken,
		mfa_verified : user.mfa_verified,
	}
    const resp = await this.userRepository.createQueryBuilder()
    .update(Users)
    .set(filtered_user)
    .where("intraId = :intraId", { intraId: intraId })
    .execute();
    if (resp.affected === 0){
	  console.log("updateUser got exception.");
      throw new NotFoundException(); // SomethingWrongException() ..?
    }
    return resp;
  }

  async getUserByIntraId(u_intraId: string): Promise<UserDTO> {
    //console.log("bus Will search:", u_intraId);
    const resp = await this.userRepository.findOneBy({ intraId: u_intraId });

    if (resp === null)
	{
		//console.log("bus Could not find", u_intraId, ", throwing error.");
		return ;
	}
	return this.singleUserDto(resp);
  }

  async getFullUser(u_intraId: string): Promise<Users> {
	//console.log("bus getFull Will search:", u_intraId);
    const resp = await this.userRepository.findOneBy({ intraId: u_intraId });
    if (resp === null)
	{
		//console.log("bus getFull Could not find", u_intraId, ", throwing error.");
		throw new NotFoundException();
	}
	return resp;
  }

  async logOut(intraId: string) {
    //let user = await this.userRepository.findOneBy({ intraId: intraId });
	//console.log("bus logOut called.");
  }

	async getOnlineUsers():Promise<UserDTO[]>{
		const resp = await this.userRepository.createQueryBuilder("allUsers")
		.select()
		.getMany();
		let out = [];
		for (const u of resp)
			if (UserService.status.get(u.intraId) != "OFFLINE")
				out.push(u);
		return this.makeUserDto(out);
		// TODO: remove main-user from this list.
	}

	async getFriends(intraId:string):Promise<UserDTO[]>
	{
		let out: UserDTO[] = [];
		const u = await this.getFullUser(intraId);
		//console.log("Friends with:", u.intraId);
		if(!u || !u.friends){
			//console.log("...got no friends");
			return out;
		}
		for (const friend of u.friends)
		{
			//console.log("...friend has", friend);
			let n = await this.getUserByIntraId(friend);
			if (!n) return;
			out.push(n);
		}
		//console.log("getFriends returning", out);
		return out;
	}

	async getBlocks(intraId:string):Promise<UserDTO[]>
	{
		let out: UserDTO[] = [];
		const u = await this.getFullUser(intraId);
		if(!u || !u.blocks){
			return out;
		}
		for (const block of u.blocks)
		{
			let n = await this.getUserByIntraId(block);
			if (!n) return;
			out.push(n);
		}
		return out;
	}

	async getStats(intraId:string):Promise<StatisticsDTO>
	{
		let out: StatisticsDTO = {} as StatisticsDTO;
		const u = await this.getFullUser(intraId);
		if(!u) return out;
		out.score = u.score;
		out.matches = u.matches;
		out.wins = u.wins;
		out.goalsMade = u.goalsMade;
		out.goalsTaken = u.goalsTaken;
		out.scorePerMatches = out.score/out.matches;
		out.looses = out.matches - out.wins;
		out.winsPerLooses = out.wins/out.looses;
		out.goalsMadePerTaken = out.goalsMade/out.goalsTaken;
		// out.ranking = 0; // TODO if so
		return out;
	}

	singleUserDto(u_user: Users):UserDTO{
		return this.makeUserDto([u_user])[0];
	}

	makeUserDto(u_users: Users[]):UserDTO[]{
		if (!u_users.length)
			return [];
		let out: UserDTO[] = [];
		u_users.forEach(function(u){
			const dto: UserDTO = {
				intraId: u.intraId,
				name: u.name,
				image: u.image,
				score: u.score,
				mfa_enabled: u.mfa_enabled,
				friends: u.friends,
				blocks: u.blocks,
				status: 
					UserService.status.get(u.intraId) ?
					UserService.status.get(u.intraId) : "OFFLINE",
			};
			out.push(dto);
		});
		return out;
	}
}
