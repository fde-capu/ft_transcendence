import { GameMode, Team } from './../entity/room.entity';
import { Dictionary } from './../entity/game.entity';
import {
  MatchHistory,
  TeamPosition,
  TeamMatchHistory,
} from '../entity/match-history.entity';
import { Users } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/service/user.service';

export function createMatchHistory(
  mode: GameMode,
  teams: Array<Team>,
  teamsScore: Dictionary<number>,
): MatchHistory {
  const match = new MatchHistory();
  match.mode = mode;
  match.teams = teams.map((t) => {
    const team = new TeamMatchHistory();
    switch (t.id) {
      case 'LEFT':
        team.position = TeamPosition.LEFT;
        break;
      case 'RIGHT':
        team.position = TeamPosition.RIGHT;
        break;
      case 'TOP':
        team.position = TeamPosition.TOP;
        break;
      case 'BOTTOM':
        team.position = TeamPosition.BOTTOM;
        break;
    }
    team.score = teamsScore[t.id];
    team.players = t.players.map((p) => {
      const user = new Users();
      user.score = team.score;
      user.intraId = p.id;
      return user;
    });
    return team;
  });
  return match;
}
