import {
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { User } from '../user';
import { Statistics } from '../statistics';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatchHistory } from '../game/entity/match-history.entity';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnChanges {
  @Input() user?: User;

  stat: Statistics = {
    goalsMade: 0,
    goalsMadePerTaken: 0,
    goalsTaken: 0,
    looses: 0,
    matches: 0,
    playingTime: 0,
    score: 0,
    scorePerMatches: 0,
    scorePerMinute: 0,
    wins: 0,
    winsPerLooses: 0,
  };

  constructor(private readonly httpClient: HttpClient) {}

  ngOnChanges(): void {
    this.loadStats();
  }

  async loadStats(): Promise<void> {
    if (!this.user) return;

    const params = new HttpParams();
    params.append('userId', this.user.intraId);

    const matches = await firstValueFrom(
      this.httpClient.get<Array<MatchHistory>>(
        `http://localhost:3000/game/history`,
        {
          params,
          withCredentials: true,
        }
      )
    );

    this.stat.matches = matches.length;

    this.stat.goalsMade = matches
      .flatMap(m => m.teams)
      .filter(t => t.score > 0)
      .filter(t => t.players.find(u => u.intraId === this.user!.intraId))
      .reduce((agg, t) => agg + t.score, 0);

    this.stat.wins = matches.reduce((agg, m) => {
      const winner = m.teams.sort((a, b) => b.score - a.score)[0];
      return (
        agg +
        (winner.players.find(u => u.intraId === this.user!.intraId) ? 1 : 0)
      );
    }, 0);

    this.stat.looses = matches.reduce((agg, m) => {
      const winner = m.teams.sort((a, b) => b.score - a.score)[0];
      return (
        agg +
        (winner.players.find(u => u.intraId === this.user!.intraId) ? 0 : 1)
      );
    }, 0);

    this.stat.winsPerLooses = this.stat.wins / this.stat.looses;
  }
}
