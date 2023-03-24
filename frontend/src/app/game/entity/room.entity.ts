export interface User {
  connected: boolean;
  id: string;
  name: string;
}

type Player = User & { ready: boolean };

export interface Team {
  players: Array<Player>;
  id: string;
  capacity: number;
}

export interface Room {
  teams: Array<Team>;
  audience: Array<User>;
  inGame: boolean;
  running: boolean;
  id: string;
  host: User;
}
