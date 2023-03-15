import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistory } from './game-record';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly historyRepository: Repository<GameHistory>,
  ) {}

  // TODO At the end of each match, backend must call this:
  // userService.setGameHistory({GameHistory})
  async setGameHistory(record: GameHistory): Promise<GameHistory> {
    return await this.historyRepository.save(record);
  }

  async getGameHistory(intraId: string): Promise<GameHistory[]> {
    if (!(await this.historyRepository.count()))
      // TODO:
      await this.mockGameHistory(); // Remove these lines.

    const resp = await this.historyRepository
      .createQueryBuilder('userPlayed')
      .where('userPlayed.idA = :idA', { idA: intraId })
      .orWhere('userPlayed.idB = :idB', { idB: intraId })
      .getMany();

    //console.log("getGameHistory got", resp);
    if (resp === null) return [];
    return resp;
  }

  // TODO: remove this mock when unused.
  async mockGameHistory() {
    //console.log("GameHistory mocking entries");
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
      date: '1680000000000',
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
      date: '1680010000000',
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
      date: '1680000100000',
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
      date: '1680001000000',
      duration: 282,
    });
    await this.setGameHistory(mock);
  }
}
