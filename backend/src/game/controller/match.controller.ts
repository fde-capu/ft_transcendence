import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { MatchHistory } from '../entity/match-history.entity';
import { MatchHistoryService } from '../service/match-history.service';

@UseGuards(AuthGuard)
@Controller('game')
export class MatchController {
  public constructor(private readonly historyService: MatchHistoryService) {}

  @Get('history')
  public async getMatchHistories(
    @Query('user') user?: string,
    @Query('mode') mode?: string,
  ): Promise<Array<MatchHistory>> {
    if (user) return await this.historyService.getMatchHistoriesByUser(user);
    if (mode)
      return await this.historyService.getMatchHistoriesByMode(parseInt(mode));
    return await this.historyService.getMatchHistories();
  }
}
