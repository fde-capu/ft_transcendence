export enum GameMode {
  PONG = 0,
  PONGDOUBLE = 1,
  QUADRAPONG = 2,
}

export interface User {
  connected: boolean;
  id: string;
  name: string;
}

export type Player = User & { ready: boolean };

export interface Team {
  players: Array<Player>;
  id: string;
  capacity: number;
  score: number;
}

export interface Room {
  teams: Array<Team>;
  audience: Array<User>;
  inGame: boolean;
  running: boolean;
  id: string;
  host: User;
  mode: GameMode;
}