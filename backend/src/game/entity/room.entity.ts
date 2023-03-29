import { hideCircular } from '../helper/hide-server.replacer';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { Game, Pong, PongDouble, Quadrapong } from './game.entity';

export type ClientSocket = Socket & { subject: string; name: string };

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
  ) {}

  public static from(client: ClientSocket): User {
    return new User(client['subject'], client['name']);
  }
}

export class Player extends User {
  public ready = false;

  public static from(user: User): Player {
    return new Player(user.id, user.name);
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
      if (
        this.inGame &&
        !this.running &&
        this.getPlayers().reduce((s, p) => p.connected && s, true)
      )
        this.resume();
      this.server.emit('game:room:status', hideCircular(this));
      this.service.listNonEmptyRooms();
      return;
    }

    this.logger.log(`Join: ${user.id}`);

    this.audience = [...this.audience, user];

    this.rebalance();

    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  public leave(user: User): void {
    this.logger.log(`Leave: ${user.id}`);

    if (this.inGame && this.getPlayers().find((p) => p.id == user.id))
      this.finish();

    this.teams.forEach((t) => {
      t.players = t.players.filter((p) => p.id != user.id);
    });

    this.audience = this.audience.filter((u) => u.id != user.id);

    if (!this.isEmpty() && this.host.id == user.id) {
      this.host = this.getUsers()[0];
    }

    this.rebalance();

    this.server.emit('game:room:status', hideCircular(this));
    this.service.deleteIfEmpty(this.id);
    this.service.listNonEmptyRooms();
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
      () => {
        if (!found.connected) this.leave(user);
      },
      this.inGame ? 5000 : 1000,
    );
  }

  private rebalance(): void {
    this.audience = this.audience.filter((u) => {
      const team = this.teams.find((t) => !t.isFull());
      if (!team) return true;
      team.players = [...team.players, Player.from(u)];
      return false;
    });
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
    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  public sendStatus(client: Socket): void {
    client.emit('game:room:status', hideCircular(this));
  }

  public ready(user: User): void {
    this.getPlayers()
      .filter((p) => p.id == user.id)
      .forEach((p) => (p.ready = !p.ready));
    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
    if (
      this.getPlayers().reduce((s, p) => p.ready && s, true) &&
      this.teams.reduce((s, t) => t.isFull() && s, true)
    ) {
      this.start();
    }
  }

  public start(): void {
    switch (this.mode) {
      case GameMode.PONG:
        this.game = new Pong({} as HTMLCanvasElement);
        break;
      case GameMode.PONGDOUBLE:
        this.game = new PongDouble({} as HTMLCanvasElement);
        break;
      case GameMode.QUADRAPONG:
        this.game = new Quadrapong({} as HTMLCanvasElement);
        break;
    }
    this.game.reset();

    setTimeout(() => {
      this.resume();
    }, 1000);

    this.inGame = true;

    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  private pause(): void {
    clearInterval(this.gameInterval);
    this.gameInterval = undefined;
    this.lastUpdate = undefined;

    this.running = false;

    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  private resume(): void {
    this.lastUpdate = Date.now();
    this.gameInterval = setInterval(() => {
      const currentTimestamp = Date.now();
      this.game?.update((currentTimestamp - this.lastUpdate) / 1000);
      this.lastUpdate = currentTimestamp;
      this.server.emit('game:status', this.game?.elements);
    }, 1000 / 25);

    this.running = true;
    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  private finish(): void {
    this.pause();

    // TODO save the score

    this.inGame = false;

    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
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
