import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { GameMode } from '../../entity/room.entity';
import {
  MatchHistory,
  MatchHistoryMap,
} from './../../entity/match-history.entity';
import { TeamPosition } from './../../entity/match-history.entity';
import { User } from 'src/app/user';
import { Dictionary } from '../../entity/game.entity';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  @Input() user?: User;

  mode: GameMode = GameMode.PONG;

  matches!: Observable<Array<MatchHistoryMap>>;

  users: Dictionary<User> = {};

  constructor(
    private readonly httpClient: HttpClient,
    private readonly userService: UserService
  ) {
    this.setMode(this.mode);
  }

  setMode(mode: GameMode | string) {
    this.mode = parseInt(mode as string);
    const params = new HttpParams();
    params.append('mode', this.mode);
    if (this.user) params.append('', this.user.intraId);
    this.matches = this.httpClient
      .get<Array<MatchHistory>>(`http://localhost:3000/game/history`, {
        params,
        withCredentials: true,
      })
      .pipe(
        tap(matches =>
          matches
            .flatMap(match => match.teams)
            .flatMap(team => team.players)
            .forEach(player => this.getUser(player.intraId))
        ),
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

  async getUser(intraId: string): Promise<void> {
    const user = await firstValueFrom(this.userService.getUserById(intraId));
    if (!user) return;
    this.users[user.intraId] = user;
  }
}
