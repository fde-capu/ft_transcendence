export class User {
  constructor(private readonly id: string, private readonly name: string) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
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
    return new Player(user.getId(), user.getName());
  }
}

export class Team {
  private players: Map<string, Player> = new Map();

  public constructor(
    private readonly name: string,
    private readonly capacity: number = 1,
  ) {
    if (capacity <= 0)
      throw new Error('Capacity must be a positive non-zero value');
  }

  public getName(): string {
    return this.name;
  }

  public isReady(): boolean {
    return Array.from(this.players.values()).reduce(
      (c, p) => c && p.isReady(),
      this.players.size == this.capacity,
    );
  }

  public resetReadyStatus(): void {
    Array.from(this.players.values()).forEach((p) => p.setReady(false));
  }

  public isFull(): boolean {
    return this.players.size == this.capacity;
  }

  public addPlayer(player: User): void {
    if (this.players.size + 1 > this.capacity)
      throw new Error('Capacity overflow');
    this.players.set(player.getId(), Player.fromUser(player));
  }

  public removePlayer(player: User): void {
    this.players.delete(player.getId());
  }

  public getPlayers(): Array<Player> {
    return Array.from(this.players.values());
  }

  public getPlayer(user: User): Player | undefined {
    return this.players.get(user.getId());
  }
}

export enum Mode {
  PONG,
  PONGDOUBLE,
  QUADRAPONG,
}

export class Room {
  private teams: Map<string, Team> = new Map();

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
    return Array.from(this.teams.values());
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
    if (userInRoom) return;
    if (!this.host) this.host = user;
    this.audience.push(user);
    this.assignPlayersToTeams();
  }

  public leave(user: User): void {
    if (this.host.getId() == user.getId()) {
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
        this.teams = new Map([
          ['left', new Team('left', 1)],
          ['right', new Team('right', 1)],
        ]);
      case Mode.PONGDOUBLE:
        this.teams = new Map([
          ['left', new Team('left', 2)],
          ['right', new Team('right', 2)],
        ]);
      case Mode.QUADRAPONG:
        this.teams = new Map([
          ['left', new Team('left', 1)],
          ['right', new Team('right', 1)],
          ['top', new Team('top', 1)],
          ['bottom', new Team('bottom', 1)],
        ]);
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
}
