import { User } from 'src/app/user';
import { GameMode } from './room.entity';
import { Dictionary } from './game.entity';

export enum TeamPosition {
  LEFT = 0,
  RIGHT = 1,
  TOP = 2,
  BOTTOM = 3,
}

export interface TeamMatchHistory {
  id: string;
  position: TeamPosition;
  score: number;
  players: Array<User>;
}

export interface MatchHistory {
  id: string;
  mode: GameMode;
  createdDate: Date;
  teams: Array<TeamMatchHistory>;
}

export interface MatchHistoryMap {
  id: string;
  mode: GameMode;
  createdDate: Date;
  teams: Dictionary<TeamMatchHistory>;
}
