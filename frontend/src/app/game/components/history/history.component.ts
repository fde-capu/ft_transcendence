import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameMode } from '../../entity/room.entity';
import {
  MatchHistory,
  MatchHistoryMap,
} from './../../entity/match-history.entity';
import {
  TeamPosition,
  TeamMatchHistory,
} from './../../entity/match-history.entity';
import { Dictionary } from './../../entity/game.entity';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  mode: GameMode = GameMode.PONG;

  matches!: Observable<Array<MatchHistoryMap>>;

  constructor(private readonly httpClient: HttpClient) {
    this.setMode(this.mode);
  }

  setMode(mode: GameMode | string) {
    this.mode = parseInt(mode as string);
    this.matches = this.httpClient
      .get<Array<MatchHistory>>(
        `http://localhost:3000/game/history?mode=${this.mode}`,
        {
          withCredentials: true,
        }
      )
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
