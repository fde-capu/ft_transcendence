import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RequestHistory } from '../dto/history.dto';
import { MatchHistory } from '../entity/match-history.entity';
import { MatchHistoryService } from '../service/match-history.service';

// @UseGuards(AuthGuard)
@Controller('game')
export class MatchController {
  public constructor(private readonly historyService: MatchHistoryService) {}

  @Get('history/bymode')
  public async getMatchHistories(
    @Query() history: RequestHistory
  ): Promise<Array<MatchHistory>> {
    return await this.historyService.getMatchHistoriesByOptions(
      history.user,
      parseInt(history.mode) || undefined,
    );
  }
  @Get('history')
  public async getMatchHistoriesByUser(
    @Query() history: RequestHistory
  ): Promise<Array<MatchHistory>> {
    return await this.historyService.getMatchHistoriesByOptions(
      history.user);
  }
}
