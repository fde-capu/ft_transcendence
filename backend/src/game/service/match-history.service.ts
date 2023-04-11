import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from '../entity/match-history.entity';
import { GameMode } from '../entity/room.entity';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchRepository: Repository<MatchHistory>,
    private readonly userService: UserService
  ) {}

  async saveMatchHistory(match: MatchHistory): Promise<MatchHistory> {
    this.updateUserScore(match);
    return await this.matchRepository.save(match);
  }

  updateUserScore(match: any) {
    match.teams.forEach((t) => t.players.forEach(async(p) => {
      const userDB = await this.userService.getUserByIntraId(p.intraId);
      p.score = p.score + userDB.score;
    }));
  }

  async getMatchHistories(): Promise<MatchHistory[]> {
    return await this.matchRepository.find({
      order: { createdDate: 'DESC' },
    });
  }

  async getMatchHistoriesByOptions(
    userId?: string,
    mode?: GameMode,
  ): Promise<MatchHistory[]> {
    let where = undefined;

    if (userId) where = { ...where, teams: { players: { intraId: userId } } };

    if (mode) where = { ...where, mode: mode };

    return await this.matchRepository.find({
      where,
      order: { createdDate: 'DESC' },
    });
  }

}
