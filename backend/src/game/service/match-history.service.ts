import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from '../entity/match-history.entity';
import { GameMode } from '../entity/room.entity';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchRepository: Repository<MatchHistory>,
  ) {}

  async saveMatchHistory(match: MatchHistory): Promise<MatchHistory> {
    return await this.matchRepository.save(match);
  }

  async getMatchHistories(): Promise<MatchHistory[]> {
    return await this.matchRepository.find({
      order: { createdDate: 'DESC' },
    });
  }

  async getMatchHistoriesByUser(userId: string): Promise<MatchHistory[]> {
    return await this.matchRepository.find({
      where: { teams: { players: { intraId: userId } } },
      order: { createdDate: 'DESC' },
    });
  }

  async getMatchHistoriesByMode(mode: GameMode): Promise<MatchHistory[]> {
    return await this.matchRepository.find({
      where: { mode: mode },
      order: { createdDate: 'DESC' },
    });
  }
}
