import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameMode } from '../../entity/room.entity';
import {
  MatchHistory,
  MatchHistoryMap,
} from './../../entity/match-history.entity';
import { TeamPosition } from './../../entity/match-history.entity';
import { User } from 'src/app/user';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  @Input() user?: User;
	routedNotInProfile?: boolean;
  mode: GameMode = GameMode.PONG;

  matches!: Observable<Array<MatchHistoryMap>>;

  constructor(
    private router: Router,
		private readonly httpClient: HttpClient,
	) {
    this.setMode(this.mode);
		this.routedNotInProfile = this.router.url.indexOf("/game") == 0;
  }

  setMode(mode: GameMode | string) {
    this.mode = parseInt(mode as string);
    const params = new HttpParams();
    params.append('mode', this.mode);
    if (this.user) params.append('', this.user.intraId);
    this.matches = this.httpClient
      .get<Array<MatchHistory>>(`${environment.BACKEND_ORIGIN}/game/history`, {
        params,
        withCredentials: true,
      })
      .pipe(
        map(matches =>
          matches.map(match => ({
            ...match,
            teams: match.teams.reduce(
              (agg, t) => ({ ...agg, [this.getPositionName(t.position)]: t }),
              {}
            ),
          }))
        )
      );
  }
  // ^ This function is currentl all matches, unregarding the mode.
  //   Which I think is a good behavior - to always show all records.
  //   TODO (if so): Rename/refactor so we don't need to use this.mode as params.

	doesThisShow(match: MatchHistoryMap) {
		if (!this.user) return true;
		if (match.mode == 0) {
			return this.user.intraId == match.teams['left'].players[0].intraId || this.user.intraId == match.teams['right'].players[0].intraId;
		} else if (match.mode == 1) {
			return	this.user.intraId == match.teams['left'].players[0].intraId || this.user.intraId == match.teams['left'].players[1].intraId
				||		this.user.intraId == match.teams['right'].players[0].intraId || this.user.intraId == match.teams['right'].players[1].intraId;
		} else if (match.mode == 2) {
			return	this.user.intraId == match.teams['left'].players[0].intraId || this.user.intraId == match.teams['right'].players[0].intraId
				||		this.user.intraId == match.teams['top'].players[0].intraId || this.user.intraId == match.teams['bottom'].players[0].intraId;
		}
		return false;
	}

  getPositionName(position: TeamPosition): string {
    switch (position) {
      case TeamPosition.LEFT:
        return 'left';
      case TeamPosition.RIGHT:
        return 'right';
      case TeamPosition.TOP:
        return 'top';
      case TeamPosition.BOTTOM:
        return 'bottom';
    }
  }
}
