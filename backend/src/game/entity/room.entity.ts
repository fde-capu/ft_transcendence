import { hideCircular } from '../helper/hide-server.replacer';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { Game, Pong, PongDouble, Quadrapong } from './game.entity';
import { createMatchHistory } from '../util/game-data-to-match-history.converter';

export type ClientSocket = Socket & {
  subject: string;
  name: string;
  image: string;
};

export enum GameMode {
  PONG = 0,
  PONGDOUBLE = 1,
  QUADRAPONG = 2,
}

export class User {
  public connected = true;

  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly image: string,
  ) {}

  public static from(client: ClientSocket): User {
    return new User(client['subject'], client['name'], client['image']);
  }
}

export class Player extends User {
  public ready = false;

  public static from(user: User): Player {
    return new Player(user.id, user.name, user.image);
  }
}

export class Team {
  public players: Array<Player> = [];

  public constructor(
    public readonly id: string,
    public readonly capacity = 1,
  ) {}

  public isFull(): boolean {
    return this.players.length == this.capacity;
  }

  public isReady(): boolean {
    return this.isFull() && this.players.every((p) => p.ready && p.connected);
  }
}

export enum RoomStage {
  WAITING = 0,
  STARTING = 1,
  RUNNING = 2,
  PAUSED = 3,
  FINISHED = 4,
}

export class Room {
  private readonly logger: Logger;

  public teams: Array<Team> = [];

  public audience: Array<User> = [];

  public inGame = false;

  public running = false;

  public mode: GameMode = GameMode.PONG;

  public game?: Game;

  public gameInterval?: NodeJS.Timer;

  public lastUpdate?: number;

  public gameTimeout?: NodeJS.Timeout;

  public stage: RoomStage = RoomStage.WAITING;

  public constructor(
    public readonly id: string,
    public server: Server,
    public readonly service: RoomsService,
    public host: User,
  ) {
    this.logger = new Logger(`Room ${id}`);
    this.logger.log(`Room ${id} created by ${host.id}`);
    this.setMode(this.mode);
  }

  public getPlayers(): Array<Player> {
    return this.teams.flatMap((t) => t.players);
  }

  public getUsers(): Array<User> {
    return [...this.getPlayers(), ...this.audience];
  }

  public isEmpty(): boolean {
    return this.getUsers().length == 0;
  }

  public join(user: User): void {
    const found = this.getUsers().find((u) => u.id == user.id);
    if (found) {
      if (!found.connected) this.logger.log(`Connected: ${user.id}`);
      found.connected = true;
      this.resume();
      this.notifyRoomStatus();
      return;
    }

    this.logger.log(`Join: ${user.id}`);

    this.audience = [...this.audience, user];

    this.rebalance();
    this.notifyRoomStatus();
  }

  public async leave(user: User): Promise<void> {
    this.logger.log(`Leave: ${user.id}`);

    if (this.inGame && this.getPlayers().find((p) => p.id == user.id))
      await this.finish();

    this.teams.forEach((t) => {
      t.players = t.players.filter((p) => p.id != user.id);
    });

    this.audience = this.audience.filter((u) => u.id != user.id);

    if (!this.isEmpty() && this.host.id == user.id) {
      this.host = this.getUsers()[0];
    }

    this.rebalance();
    this.notifyRoomStatus();
    this.service.deleteIfEmpty(this.id);
  }

  public disconnect(user: User): void {
    const found = this.getUsers().find((u) => u.id == user.id);
    if (!found) return;

    this.logger.log(`Disconnected: ${user.id}`);

    found.connected = false;

    const player = this.getPlayers().find((p) => p.id == user.id);
    if (player) {
      player.ready = false;
      if (this.inGame) this.pause();
    }

    setTimeout(
      async () => {
        if (!found.connected) await this.leave(found);
      },
      this.inGame && player ? 1200000 : 10000,
    );

    this.rebalance();
    this.notifyRoomStatus();
  }

  private rebalance(): void {
    // Rebalance only if there is no game running
    if (this.inGame) return;

    // move disconnected players to audience
    this.teams.forEach((t) => {
      t.players = t.players.filter((p) => {
        if (p.connected) return true;
        this.audience = [...this.audience, p];
        return false;
      });
    });

    // move audience to teams if possible
    this.audience = this.audience.filter((u) => {
      const team = this.teams.find((t) => !t.isFull());
      if (!team) return true;
      team.players = [...team.players, Player.from(u)];
      return false;
    });

    // Change host if it is disconnected or doesn't exist
    if (!this.host || !this.host.connected) {
      const newHost = this.getPlayers().find((u) => u.connected);
      if (newHost) this.host = newHost;
    }
  }

  private notifyRoomStatus(): void {
    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  public setMode(mode: GameMode): void {
    this.mode = mode;
    this.audience = this.getUsers();
    switch (mode) {
      case GameMode.PONG:
        this.teams = [new Team('LEFT', 1), new Team('RIGHT', 1)];
        break;
      case GameMode.PONGDOUBLE:
        this.teams = [new Team('LEFT', 2), new Team('RIGHT', 2)];
        break;
      case GameMode.QUADRAPONG:
        this.teams = [
          new Team('LEFT', 1),
          new Team('RIGHT', 1),
          new Team('TOP', 1),
          new Team('BOTTOM', 1),
        ];
        break;
    }
    this.rebalance();
    this.notifyRoomStatus();
  }

  public sendStatus(client: Socket): void {
    client.emit('game:room:status', hideCircular(this));
  }

  public ready(user: User): void {
    this.getPlayers()
      .filter((p) => p.id == user.id)
      .forEach((p) => (p.ready = !p.ready));
    this.notifyRoomStatus();
    if (this.teams.every((t) => t.isReady())) {
      this.start();
    }
  }

  public async start() {
    if (this.stage !== RoomStage.WAITING) return;

    switch (this.mode) {
      case GameMode.PONG:
        this.game = new Pong();
        this.game.playerPaddle = {
          [this.teams[0].players[0].id]: 'left',
          [this.teams[1].players[0].id]: 'right',
        };
        break;
      case GameMode.PONGDOUBLE:
        this.game = new PongDouble();
        this.game.playerPaddle = {
          [this.teams[0].players[0].id]: 'left1',
          [this.teams[0].players[1].id]: 'left2',
          [this.teams[1].players[0].id]: 'right1',
          [this.teams[1].players[1].id]: 'right2',
        };
        break;
      case GameMode.QUADRAPONG:
        this.game = new Quadrapong();
        this.game.playerPaddle = {
          [this.teams[0].players[0].id]: 'left',
          [this.teams[1].players[0].id]: 'right',
          [this.teams[2].players[0].id]: 'top',
          [this.teams[3].players[0].id]: 'bottom',
        };
        break;
    }

    this.game.reset();
    this.inGame = true;
    this.stage = RoomStage.STARTING;

    this.notifyRoomStatus();

    setTimeout(() => {
      this.resume();
      this.gameTimeout = setTimeout(() => this.finish(), 100000);
    }, 3000);
  }

  private pause(): void {
    if (![RoomStage.RUNNING, RoomStage.STARTING].includes(this.stage)) return;

    this.running = false;
    this.stage = RoomStage.PAUSED;

    clearInterval(this.gameInterval);
    this.lastUpdate = undefined;
    this.gameInterval = undefined;

    this.server.emit('game:status', this.game?.elements);

    this.notifyRoomStatus();
  }

  private resume(): void {
    if (![RoomStage.PAUSED, RoomStage.STARTING].includes(this.stage)) return;

    if (!this.teams.every((t) => t.isReady())) return;

    this.lastUpdate = Date.now();
    this.gameInterval = setInterval(() => {
      const currentTimestamp = Date.now();
      if (this.running)
        this.game?.update((currentTimestamp - this.lastUpdate) / 1000);
      this.lastUpdate = currentTimestamp;
      this.server.emit('game:status', this.game?.elements);
    }, 1000 / 25);

    this.running = true;
    this.stage = RoomStage.RUNNING;
    this.notifyRoomStatus();
  }

  private async finish(): Promise<void> {
    if (this.inGame === false) return;

    this.inGame = false;
    this.stage = RoomStage.FINISHED;

    if (this.gameTimeout) clearTimeout(this.gameTimeout);
    if (this.gameInterval) clearInterval(this.gameInterval);
    this.lastUpdate = undefined;
    this.gameInterval = undefined;

    let match = createMatchHistory(
      structuredClone(this.mode),
      structuredClone(this.teams),
      structuredClone(this.game?.elements.teams),
    );

    match = await this.service.historyService.saveMatchHistory(match);
    this.logger.log(`Match finished: ${match.id}`);

    this.notifyRoomStatus();

    setTimeout(() => {
      this.stage = RoomStage.WAITING;
      this.rebalance();
      this.notifyRoomStatus();
    }, 3000);
  }

  public moveForward(user: User): void {
    this.game?.moveForward(user.id);
  }

  public moveBackward(user: User): void {
    this.game?.moveBackward(user.id);
  }

  public stopMovement(user: User): void {
    this.game?.stopMovement(user.id);
  }
}
