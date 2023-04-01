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
    return await this.historyService.getMatchHistoriesByOptions(
      user,
      parseInt(mode) || undefined,
    );
  }
}
