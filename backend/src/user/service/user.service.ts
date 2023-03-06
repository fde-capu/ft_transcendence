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
  mfa_enabled?: boolean,
  mfa_verified?: boolean,
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
	@InjectRepository(GameHistory) private readonly historyRepository: Repository<GameHistory>,
  ) {}


  // async register(codeFrom42: Users): Promise<Users> {
  //   const existUser = await this.userRepository.findOneBy({ intraId: codeFrom42.login });
  //   if (existUser === null){
  //     const createdUser =  this.userRepository.create({ intraId: codeFrom42.login, email: codeFrom42.email });
  //     return (await this.userRepository.save(createdUser));
  //   }
  //   await this.updateUser(codeFrom42.login, { mfa_enabled: true,  mfa_verified: false });
  //   return ({ intraId: codeFrom42.login, mfa_enabled: true,  mfa_verified: false });
  // }
  // ^ I guess the code above is not necessary.

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
		score: 0,
		matches : 0,
		wins : 0,
		goalsMade : 0,
		goalsTaken : 0,
	  });
      existUser = await this.userRepository.save(createdUser);
    }
	await this.updateUser(existUser.intraId, { mfa_verified: false, isLogged: true });
	// Como este se trata do "OK da 42", apenas sempre desverificar só o mfa.
	// Aliás pode desimplementar o registro do mfa_verified na db.
    return ({ intraId: existUser.intraId, mfa_enabled: existUser.mfa_enabled,  mfa_verified: false }); 
  }
  
  async updateUser(intraId: string, user: Users){
	//console.log("updateUser user", user);
    const resp = await this.userRepository.createQueryBuilder()
    .update(Users)
    .set(user)
    .where("intraId = :intraId", { intraId: intraId })
    .execute();
    if (resp.affected === 0){
		//console.log("updateUser got exception.");
      throw new NotFoundException(); // SomethingWrongException() ..?
    }
	//console.log("updateUser resp", resp);
    return resp;
  }

  async getUserByIntraId(u_intraId: string): Promise<UserDTO> {
	//console.log("bus Will search:", u_intraId);
    const resp = await this.userRepository.findOneBy({ intraId: u_intraId });
    if (resp === null)
	{
		//console.log("bus Could not find", u_intraId, ", throwing error.");
		throw new NotFoundException();
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
    let user = await this.userRepository.findOneBy({ intraId: intraId });
	//console.log("bus logOut called.");
  }

	async getOnlineUsers():Promise<UserDTO[]>{
		const resp = await this.userRepository.createQueryBuilder("onlineUsers")
		.where("onlineUsers.isLogged = :isLogged", { isLogged: true })
		.getMany();
		return this.makeUserDto(resp);
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

	async mockGameHistory() {
		console.log("GameHistory mocking entries");
		let mock = this.historyRepository.create({
			idA: 'fde-capu',
			idB: 'blabla',
			playerA: 'Flávio Carrara De Capua',
			playerB: 'Blats Bla',
			scoreA: 56789,
			scoreB: 23456,
			goalsA: 5,
			goalsB: 3,
			winA: true,
			winB: false,
			date: "1680000000000",
			duration: 240,
		});
		await this.setGameHistory(mock);
		mock = this.historyRepository.create({
			idA: 'bleble',
			idB: 'fde-capu',
			playerA: 'Blebs Bleb Custom Name',
			playerB: 'Anyname I was at the time',
			scoreA: 43210,
			scoreB: 34567,
			goalsA: 5,
			goalsB: 4,
			winA: true,
			winB: false,
			date: "1680010000000",
			duration: 420,
		});
		await this.setGameHistory(mock);
		mock = this.historyRepository.create({
			idA: 'blibli',
			idB: 'bloblo',
			playerA: 'Master of Pong',
			playerB: 'Zchrwstzcherckendumpteri-Dino',
			scoreA: 53210,
			scoreB: 64567,
			goalsA: 4,
			goalsB: 5,
			winA: false,
			winB: true,
			date: "1680000100000",
			duration: 378,
		});
		await this.setGameHistory(mock);
		mock = this.historyRepository.create({
			idA: 'blublu',
			idB: 'fde-capu',
			playerA: 'Blublublublub Blublub',
			playerB: 'Flávio De Capua',
			scoreA: 56789,
			scoreB: 83456,
			goalsA: 4,
			goalsB: 5,
			winA: false,
			winB: true,
			date: "1680001000000",
			duration: 282,
		});
		await this.setGameHistory(mock);
	}

	async setGameHistory(record:GameHistory):Promise<GameHistory>
	{
		return await this.historyRepository.save(record);
	}

	async getGameHistory(intraId:string):Promise<GameHistory[]>
	{
		let out: GameHistory[] = [];

		if (!await this.historyRepository.count())	// TODO:
			await this.mockGameHistory();			// Remove these lines.
		
		const resp = await this.historyRepository.createQueryBuilder("userPlayed")
			.where("userPlayed.idA = :idA", { idA: intraId })
			.orWhere("userPlayed.idB = :idB", { idB: intraId })
			.getMany();

		console.log("getGameHistory got", resp);
		if (resp === null)
			return [];
		return resp;
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
			};
			out.push(dto);
		});
		return out;
	}
}
