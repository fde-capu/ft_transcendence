import { ClientSocket } from '../service/room.service';
import { Server } from 'socket.io';
import { hideServer } from '../helper/hide-server.replacer';

export class User {
  public connected = true;

  public constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  public static from(client: ClientSocket): User {
    return new User(client.subject, client.name);
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
}

export class Room {
  public teams: Array<Team> = [];

  public audience: Array<User> = [];

  public inGame = false;

  public running = false;

  public server: Server;

  public constructor(public readonly id: string, public host: User) {}

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
      found.connected = true;
      if (
        this.inGame &&
        !this.running &&
        this.getPlayers().reduce((s, p) => p.connected && s, true)
      )
        this.resume();
      return;
    }

    this.audience = [...this.audience, user];

    this.server.emit('game:room:status', JSON.stringify(this, hideServer));
  }

  public leave(user: User): void {
    if (this.inGame && this.getPlayers().find((p) => p.id == user.id))
      this.finish();

    this.teams.forEach((t) => {
      t.players = t.players.filter((p) => p.id == user.id);
    });

    this.audience = this.audience.filter((u) => u.id != user.id);

    if (!this.isEmpty() && this.host.id == user.id)
      this.host = this.getUsers()[0];

    this.server.emit('game:room:status', JSON.stringify(this, hideServer));
  }

  public disconnect(user: User): void {
    if (!this.inGame) {
      this.leave(user);
      return;
    }

    const found = this.getUsers().find((u) => u.id == user.id);
    found.connected = false;

    if (this.inGame && this.getPlayers().find((p) => p.id == user.id))
      this.pause();

    setTimeout(() => {
      if (!found.connected) this.leave(user);
    }, 5000);

    this.server.emit('game:room:status', JSON.stringify(this, hideServer));
  }

  public start(): void {
    this.inGame = true;
    this.running = true;
    // TODO
  }

  private pause(): void {
    this.running = false;
    // TODO
  }

  private resume(): void {
    this.running = true;
    // TODO
  }

  private finish(): void {
    this.inGame = false;
    this.running = false;
    // TODO
  }
}
