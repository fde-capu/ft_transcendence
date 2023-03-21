import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users, UserDTO, StatisticsDTO } from '../user/entity/user.entity';
import { GameHistory } from './game-record';

@Injectable()
export class GameService {
  constructor(
	@InjectRepository(GameHistory) private readonly historyRepository: Repository<GameHistory>,
  ) {}

	// TODO At the end of each match, backend must call this:
	// userService.setGameHistory({GameHistory})
	async setGameHistory(record:GameHistory):Promise<GameHistory>
	{
		return await this.historyRepository.save(record);
	}
	
	async getGameHistory(intraId:string):Promise<GameHistory[]>
	{
		//console.log("getGameHistory for", intraId);
		let out: GameHistory[] = [];

		if (!await this.historyRepository.count())	// TODO:
			await this.mockGameHistory();			// Remove these lines.
		
		const resp = await this.historyRepository.createQueryBuilder("match")
			.where("match.p1_intraId = :p1_intraId", { p1_intraId: intraId })
			.orWhere("match.p2_intraId = :p2_intraId", { p2_intraId: intraId })
			.orWhere("match.p3_intraId = :p3_intraId", { p3_intraId: intraId })
			.orWhere("match.p4_intraId = :p4_intraId", { p4_intraId: intraId })
			.getMany();
		//console.log("getGameHistory got", resp);

		if (resp === null)
			return [];
		return resp;
	}

	// TODO: remove this mock when unused.
	async mockGameHistory() {
		//console.log("GameHistory mocking entries");
		let mock = this.historyRepository.create(
			{
				mode: 'PONG',

				p1_intraId: "fde-capu",
				p1_nameInGame: "Flavs",
				p1_scoreMade: 123456,
				p1_goalsMade: 5,
				p1_goalsTaken: 2,

				p2_intraId: "tanana",
				p2_nameInGame: "Tananita",
				p2_scoreMade: 1276345,
				p2_goalsMade: 41,
				p2_goalsTaken: 1,

				p3_intraId: "",
				p3_nameInGame: "",
				p3_scoreMade: 0,
				p3_goalsMade: 0,
				p3_goalsTaken: 0,

				p4_intraId: "",
				p4_nameInGame: "",
				p4_scoreMade: 0,
				p4_goalsMade: 0,
				p4_goalsTaken: 0,

				date: "1680000000000",
				duration: 420,
			}
		);
		await this.setGameHistory(mock);
		mock = this.historyRepository.create(
			{
				mode: 'PONG2',

				p1_intraId: "fde-capu",
				p1_nameInGame: "Flavs",
				p1_scoreMade: 123456,
				p1_goalsMade: 5,
				p1_goalsTaken: 2,

				p2_intraId: "tanana",
				p2_nameInGame: "Tananita",
				p2_scoreMade: 1276345,
				p2_goalsMade: 41,
				p2_goalsTaken: 1,

				p3_intraId: "minchin",
				p3_nameInGame: "Some random person",
				p3_scoreMade: 2134345,
				p3_goalsMade: 12,
				p3_goalsTaken: 7,

				p4_intraId: "mushka-d",
				p4_nameInGame: "Another random unexisten guy not even in the database (this is mock)",
				p4_scoreMade: 24354,
				p4_goalsMade: 24,
				p4_goalsTaken: 6,

				date: "1690000000000",
				duration: 420,
			}
		);
		await this.setGameHistory(mock);
		mock = this.historyRepository.create(
			{
				mode: 'PONG4',

				p1_intraId: "fde-capu",
				p1_nameInGame: "Flavs",
				p1_scoreMade: 123456,
				p1_goalsMade: 5,
				p1_goalsTaken: 2,

				p2_intraId: "tanana",
				p2_nameInGame: "Tananita",
				p2_scoreMade: 1276345,
				p2_goalsMade: 41,
				p2_goalsTaken: 1,

				p3_intraId: "minchin",
				p3_nameInGame: "Some random person",
				p3_scoreMade: 2134345,
				p3_goalsMade: 12,
				p3_goalsTaken: 7,

				p4_intraId: "mushka-d",
				p4_nameInGame: "Another random unexisten guy not even in the database (this is mock)",
				p4_scoreMade: 24354,
				p4_goalsMade: 24,
				p4_goalsTaken: 6,

				date: "1700000000000",
				duration: 420,
			}
		);
		await this.setGameHistory(mock);
	}
}

