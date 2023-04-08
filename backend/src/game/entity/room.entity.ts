import { hideCircular } from '../helper/hide-server.replacer';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RoomsService } from '../service/rooms.service';
import { Game, Pong, PongDouble, Quadrapong } from './game.entity';
import { createMatchHistory } from '../util/game-data-to-match-history.converter';
import { UserService } from 'src/user/service/user.service';

export type ClientSocket = Socket & { subject: string; name: string, image: string };

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
}

export class Room {

	private static matchDuration: number = 1000 * 100;

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

  private readonly userService: UserService
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
      this.inGame ? 1000 * 60 * 2 : 1000,
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

  public async start() {
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
		this.pause();
    this.server.emit('game:room:status', hideCircular(this));

    this.service.listNonEmptyRooms();

    await new Promise(resolve => setTimeout(resolve, 3000));
		this.resume();
  }

  private pause(): void {
    this.gameInterval = undefined;
    this.lastUpdate = undefined;

    this.running = false;
    this.game.elements.running = false;
    this.server.emit('game:status', this.game?.elements);
    clearInterval(this.gameInterval);

    this.server.emit('game:room:status', hideCircular(this));
    this.service.listNonEmptyRooms();
  }

  private resume(): void {
    this.game.elements.running = true;
    if (!this.gameTimeout)
      setTimeout(() => {
        this.finish();
      }, Room.matchDuration);
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

  private async finish(): Promise<void> {
    if (this.inGame === false) return;
    this.inGame = false;

    this.pause();
    this.teams.forEach((t) => t.players.forEach((p) => (p.ready = false)));
    if (this.gameTimeout) clearTimeout(this.gameTimeout);

    let match = createMatchHistory(
      structuredClone(this.mode),
      structuredClone(this.teams),
      structuredClone(this.game?.elements.teams),
    );

    match = await this.service.historyService.saveMatchHistory(match);
    this.logger.log(`Match finished: ${match.id}`);

		console.log("finish():", match);

    const user = await this.userService.getAllUsers();
      console.log(user);
		// GREAT, THANKS!


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
