export interface User {
  id: string;
  name: string;
}

export type Player = User & { ready: boolean };

export interface Team {
  players: { [id: string]: Player };
}

export enum Mode {
  PONG,
  PONGDOUBLE,
  QUADRAPONG,
}

export interface Room {
  teams: { [id: string]: Team };
  audience: Array<User>;
  mode: Mode;
  inGame: boolean;
  host?: User;
  id: string;
}
