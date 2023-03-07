export class User {
  private connected = true;

  constructor(private readonly id: string, private readonly name: string) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getConnected(): boolean {
    return this.connected;
  }

  public setConnected(value: boolean): void {
    this.connected = value;
  }
}

export class Player extends User {
  private ready = false;

  public constructor(id: string, name: string) {
    super(id, name);
  }

  public isReady(): boolean {
    return this.ready;
  }

  public setReady(status: boolean): void {
    this.ready = status;
  }

  static fromUser(user: User): Player {
    const player = new Player(user.getId(), user.getName());
    player.setConnected(user.getConnected());
    return player;
  }

  public setConnected(value: boolean): void {
    if (!value) this.setReady(false);
    super.setConnected(value);
  }
}

export class Team {
  private players: { [id: string]: Player } = {};

  public constructor(private readonly capacity: number = 1) {
    if (capacity <= 0)
      throw new Error('Capacity must be a positive non-zero value');
  }

  public isReady(): boolean {
    return Object.values(this.players).reduce(
      (c, p) => c && p.isReady(),
      this.isFull(),
    );
  }

  public resetReadyStatus(): void {
    Object.values(this.players).forEach((p) => p.setReady(false));
  }

  public isFull(): boolean {
    return Object.keys(this.players).length == this.capacity;
  }

  public addPlayer(player: User): void {
    if (Object.keys(this.players).length + 1 > this.capacity)
      throw new Error('Capacity overflow');
    this.players[player.getId()] = Player.fromUser(player);
  }

  public removePlayer(player: User): void {
    delete this.players[player.getId()];
  }

  public getPlayers(): Array<Player> {
    return Object.values(this.players);
  }

  public getPlayer(user: User): Player | undefined {
    return this.players[user.getId()];
  }
}

export enum Mode {
  PONG,
  PONGDOUBLE,
  QUADRAPONG,
}

export class Room {
  private teams: { [id: string]: Team } = {};

  private audience: Array<User> = [];

  private mode: Mode = Mode.PONG;

  private inGame = false;

  private host?: User;

  public constructor(private readonly id: string) {
    this.setMode(this.mode);
  }

  public getId(): string {
    return this.id;
  }

  public getHost(): User {
    return this.host;
  }

  public getTeams(): Array<Team> {
    return Object.values(this.teams);
  }

  private assignPlayersToTeams(): void {
    let team: Team;
    this.audience = [
      ...this.audience.filter((u) => {
        team = this.getTeams().find((t) => !t.isFull() && t != team);
        if (!team) return true;
        team.addPlayer(u);
        return false;
      }),
    ];
  }

  public join(user: User): void {
    const userInRoom =
      this.audience.find((u) => u.getId() == user.getId()) ||
      this.getTeams()
        .map((t) => t.getPlayer(user))
        .find((p) => p != null);
    if (userInRoom) {
      userInRoom.setConnected(true);
      return;
    }
    user.setConnected(true);
    if (!this.host) this.host = user;
    this.audience.push(user);
    this.assignPlayersToTeams();
  }

  public leave(user: User): void {
    if (this.host?.getId() == user.getId()) {
      this.host = this.getTeams()
        .flatMap((t) => t.getPlayers())
        .find((p) => p.getId() != user.getId());
    }
    this.getTeams().forEach((t) => t.removePlayer(user));
    this.audience = this.audience.filter((u) => u != user);
    this.assignPlayersToTeams();
  }

  public isReady(): boolean {
    return this.getTeams().reduce((c, t) => c && t.isReady(), true);
  }

  public resetReadyStatus(): void {
    this.getTeams().forEach((t) => t.resetReadyStatus());
  }

  public getMode(): Mode {
    return this.mode;
  }

  public setMode(mode: Mode): void {
    this.resetReadyStatus();
    this.audience = [
      ...this.getTeams().flatMap((t) => t.getPlayers()),
      ...this.audience,
    ];
    switch (mode) {
      case Mode.PONG:
        this.teams = {
          left: new Team(1),
          right: new Team(1),
        };
      case Mode.PONGDOUBLE:
        this.teams = {
          left: new Team(2),
          right: new Team(2),
        };
      case Mode.QUADRAPONG:
        this.teams = {
          left: new Team(1),
          right: new Team(1),
          top: new Team(1),
          bottom: new Team(1),
        };
    }
    this.mode = mode;
    this.assignPlayersToTeams();
  }

  public isInGame(): boolean {
    return this.inGame;
  }

  public setStatus(inGame: boolean): void {
    if (!this.isReady() && inGame)
      throw new Error('All players must be ready before starting the game');
    this.inGame = inGame;
  }

  public getUsers(): Array<User> {
    return this.audience.concat(this.getTeams().flatMap((t) => t.getPlayers()));
  }

  public disconnect(user: User): void {
    const u = this.getUsers().find((u) => u.getId() == user.getId());
    if (u) {
      u.setConnected(false);
      setTimeout(() => {
        if (!u.getConnected()) this.leave(u);
      }, 5000);
    }
  }

  public isEmpty(): boolean {
    return !!this.host;
  }
}
