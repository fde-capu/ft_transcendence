import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { Statistics } from '../statistics';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatchHistory, TeamMatchHistory } from '../game/entity/match-history.entity';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnChanges {
  @Input() user?: User;

  stat: Statistics = {
    matches: 0,
    wins: 0,
    draws: 0,
    looses: 0,
    winsPerLooses: 0,
    totalScore: 0,
    position: 0,
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
        `${environment.BACKEND_ORIGIN}/game/history`,
        {
          params,
          withCredentials: true,
        }
      )
    );

    //tem que arrumar aqui...
    const leaderboard = await firstValueFrom(
      this.httpClient.get<Array<User>>(
        `${environment.BACKEND_ORIGIN}/user/rankingAll`,
        {
          withCredentials: true,
        }
      )
    );

    const rankingPosition = await firstValueFrom(
      this.httpClient.get<number>(
        `${environment.BACKEND_ORIGIN}/user/ranking/` + this.user!.intraId,
        {
          withCredentials: true,
        }
      )
    );
   
    this.stat.position = rankingPosition;

    this.stat.totalScore = matches
      .flatMap(m => m.teams)
      .filter(t => t.score > 0)
      .filter(t => t.players.find(u => u.intraId === this.user!.intraId))
      .reduce((agg, t) => agg + t.score, 0);
		// ^ Are we sure the totalScore will be the same that is registeres on DB?

		// v Yes, a function inside a function!
		function isDrawn(teams: Array<TeamMatchHistory>): boolean {
			let testScore: number = -1;
			for (const team of teams) {
				if (testScore == -1) testScore = team.score;
				if (team.score != testScore) return false;
			}
			return true;
		}

		let localWins: number = 0;
		let localDraws: number = 0;
		let localLooses: number = 0;
		for (const m of matches) {
      const winner = m.teams.sort((a, b) => b.score - a.score)[0];
			if (this.doesThisShow(m)) {
				if (isDrawn(m.teams))
					localDraws++;
				else if (winner.players.find(u => u.intraId === this.user!.intraId))
					localWins++;
				else
					localLooses++;
			}
		}
		this.stat.draws = localDraws;
		this.stat.wins = localWins;
		this.stat.looses = localLooses;
    this.stat.matches = this.stat.wins + this.stat.looses + this.stat.draws;
    this.stat.winsPerLooses = this.stat.wins / this.stat.looses || 0;
  }

	doesThisShow(match: MatchHistory) {
			if (!this.user) return true;
			if (match.mode == 0) {
				return this.user.intraId == match.teams[0].players[0].intraId || this.user.intraId == match.teams[1].players[0].intraId;
			} else if (match.mode == 1) {
				return	this.user.intraId == match.teams[0].players[0].intraId || this.user.intraId == match.teams[0].players[1].intraId
					||		this.user.intraId == match.teams[1].players[0].intraId || this.user.intraId == match.teams[1].players[1].intraId;
			} else if (match.mode == 2) {
				return	this.user.intraId == match.teams[0].players[0].intraId || this.user.intraId == match.teams[1].players[0].intraId
					||		this.user.intraId == match.teams[2].players[0].intraId || this.user.intraId == match.teams[3].players[0].intraId;
			}
			return false;
		}
}
