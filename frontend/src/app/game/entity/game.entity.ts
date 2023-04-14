export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface Dictionary<T> {
  [index: string]: T;
}

interface Collision {
  entryTime: number;
  xnormal: number;
  ynormal: number;
}

class Rectangle {
  public constructor(
    public x = 0,
    public y = 0,
    public w = 0,
    public h = 0,
    public vx = 0,
    public vy = 0,
    public sx = 0,
    public sy = 0
  ) {}

  public collision(b: Rectangle) {
    if (this === b) return;

    // Relative velocity
    const r = new Rectangle(b.x, b.y, b.w, b.h, b.vx - this.vx, b.vy - this.vy);

    // Broadphase
    const bp = new Rectangle(
      r.vx > 0 ? r.x : r.x + r.vx,
      r.vy > 0 ? r.y : r.y + r.vy,
      r.vx > 0 ? r.w + r.vx : r.w - r.vx,
      r.vy > 0 ? r.h + r.vy : r.h - r.vy
    );

    // Simple AABB Check
    if (
      bp.x + bp.w < this.x ||
      bp.x > this.x + this.w ||
      bp.y + bp.h < this.y ||
      bp.y > this.y + this.h
    )
      return;

    // Swept AABB
    let dxEntry, dxExit;
    if (b.vx > 0) {
      dxEntry = this.x - (b.x + b.w);
      dxExit = this.x + this.w - b.x;
    } else {
      dxEntry = this.x + this.w - b.x;
      dxExit = this.x - (b.x + b.w);
    }

    let dyEntry, dyExit;
    if (b.vy > 0) {
      dyEntry = this.y - (b.y + b.h);
      dyExit = this.y + this.h - b.y;
    } else {
      dyEntry = this.y + this.h - b.y;
      dyExit = this.y - (b.y + b.h);
    }

    let txEntry, txExit;
    if (b.vx === 0) {
      txEntry = -Infinity;
      txExit = Infinity;
    } else {
      txEntry = dxEntry / b.vx;
      txExit = dxExit / b.vx;
    }

    let tyEntry, tyExit;
    if (b.vy === 0) {
      tyEntry = -Infinity;
      tyExit = Infinity;
    } else {
      tyEntry = dyEntry / b.vy;
      tyExit = dyExit / b.vy;
    }

    const entryTime = Math.max(txEntry, tyEntry);
    const exitTime = Math.min(txExit, tyExit);

    if (
      entryTime > exitTime ||
      (txEntry < 0 && tyEntry < 0) ||
      txEntry > 1 ||
      tyEntry > 1
    )
      return;

    let xnormal, ynormal;
    if (txEntry > tyEntry) {
      if (dxEntry < 0) {
        xnormal = 1;
        ynormal = 0;
      } else {
        xnormal = -1;
        ynormal = 0;
      }
    } else {
      if (dyEntry < 0) {
        xnormal = 0;
        ynormal = 1;
      } else {
        xnormal = 0;
        ynormal = -1;
      }
    }

    return { entryTime, xnormal, ynormal };
  }

  public setVelocity(dt: number) {
    this.vx = this.sx * dt;
    this.vy = this.sy * dt;
  }

  public move(dt = 1) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.vx *= 1 - dt;
    this.vy *= 1 - dt;
  }
}

class Wall extends Rectangle {
  public constructor(x = 0, y = 0, w = 0, h = 0) {
    super(x, y, w, h);
  }
}

class Ball extends Rectangle {
  static s = 10;

  public team?: string;

  public outside = false;

  public constructor() {
    super(
      Game.w / 2 - Ball.s / 2,
      Game.h / 2 - Ball.s / 2,
      Ball.s,
      Ball.s,
      0,
      0
    );
  }

  public reset() {
    this.team = undefined;
    this.outside = false;

    this.x = Game.w / 2 - Ball.s / 2;
    this.y = Game.h / 2 - Ball.s / 2;

    const rad = (n: number) => (Math.PI * n) / 180;

    let alpha: number;
    do {
      alpha = Math.PI * 2 * Math.random();
    } while (
      (rad(-10) <= alpha && alpha <= rad(10)) ||
      (rad(80) <= alpha && alpha <= rad(100)) ||
      (rad(170) <= alpha && alpha <= rad(190)) ||
      (rad(260) <= alpha && alpha <= rad(280))
    );

    this.sx = 200 * Math.cos(alpha);
    this.sy = 200 * Math.sin(alpha);
  }
}

abstract class Paddle extends Rectangle {
  static shortSide = 15;
  static longSide = 50;

  public constructor(public readonly team: string, x = 0, y = 0, w = 0, h = 0) {
    super(x, y, w, h);
  }

  public stopMovement(): void {
    this.sx = 0;
    this.sy = 0;
  }

  public abstract moveForward(): void;

  public abstract moveBackward(): void;

  public abstract getOutputAngle(ball: Ball): number;
}

abstract class VerticalPaddle extends Paddle {
  static w = Paddle.shortSide;
  static h = Paddle.longSide;

  public constructor(team: string, x = 0) {
    super(
      team,
      x,
      Game.h / 2 - Paddle.longSide / 2,
      Paddle.shortSide,
      Paddle.longSide
    );
  }

  public override setVelocity(dt: number): void {
    super.setVelocity(dt);
    if (this.vy < -this.y) this.vy = -this.y;
    const d = Game.h - this.y - this.h;
    if (this.vy > d) this.vy = d;
  }

  public override moveForward(): void {
    this.sy = 300;
  }

  public override moveBackward(): void {
    this.sy = -300;
  }

  public override getOutputAngle(ball: Ball): number {
    return (
      (ball.y + ball.h / 2 - this.y - VerticalPaddle.h / 2) /
      (VerticalPaddle.h / 2)
    );
  }
}

class LeftPaddle extends VerticalPaddle {
  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vx > 0) return;
    return c;
  }

  public override getOutputAngle(ball: Ball): number {
    return (Math.PI / 4) * super.getOutputAngle(ball);
  }
}

class RightPaddle extends VerticalPaddle {
  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vx < 0) return;
    return c;
  }

  public override getOutputAngle(ball: Ball): number {
    return (Math.PI / 4) * super.getOutputAngle(ball) - Math.PI;
  }
}

abstract class HorizontalPaddle extends Paddle {
  static w = Paddle.longSide;
  static h = Paddle.shortSide;

  public constructor(team: string, y = 0) {
    super(
      team,
      Game.w / 2 - Paddle.longSide / 2,
      y,
      Paddle.longSide,
      Paddle.shortSide
    );
  }

  public override setVelocity(dt: number): void {
    super.setVelocity(dt);
    if (this.vx < -this.x) this.vx = -this.x;
    const d = Game.w - this.x - this.w;
    if (this.vx > d) this.vx = d;
  }

  public override moveForward(): void {
    this.sx = 300;
  }

  public override moveBackward(): void {
    this.sx = -300;
  }

  public override getOutputAngle(ball: Ball): number {
    return (
      (ball.x + ball.w / 2 - this.x - HorizontalPaddle.w / 2) /
      (HorizontalPaddle.w / 2)
    );
  }
}

class TopPaddle extends HorizontalPaddle {
  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vy > 0) return;
    return c;
  }

  public override getOutputAngle(ball: Ball): number {
    return (Math.PI / 4) * super.getOutputAngle(ball) - Math.PI / 2;
  }
}

class BottomPaddle extends HorizontalPaddle {
  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vy < 0) return;
    return c;
  }

  public override getOutputAngle(ball: Ball): number {
    return (Math.PI / 4) * super.getOutputAngle(ball) + Math.PI / 2;
  }
}

export enum GameSound {
  PADDLE = 0,
  WALL = 1,
  SCORE = 2,
}

export interface GameData {
  teams: Dictionary<number>;
  balls: Dictionary<Ball>;
  paddles: Dictionary<Paddle>;
  walls: Dictionary<Wall>;
  sounds: Array<GameSound>;
}

interface CollisionData {
  collision: Collision;
  subject: Ball;
  target: Rectangle;
}

export abstract class Game {
  static w = 500;
  static h = 500;

  protected context?: CanvasRenderingContext2D;

  public elements: GameData = {
    teams: {},
    balls: {},
    paddles: {},
    walls: {},
    sounds: [],
  };

  public playerPaddle: Dictionary<string> = {};

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) {
      canvas.width = Game.w;
      canvas.height = Game.h;

      this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (!this.context) throw new Error('Canvas is not supported!');

      this.context.fillStyle = 'white';
    }
  }

  update(t = 1) {
    this.elements.sounds = [];

    const balls = Object.values(this.elements.balls).filter(b => !b.outside);
    const paddles = Object.values(this.elements.paddles);
    const walls = Object.values(this.elements.walls);

    balls.forEach(b => b.setVelocity(t));
    paddles.forEach(p => p.setVelocity(t));

    const collisionables: Array<Rectangle> = [...paddles, ...walls];

    let data: CollisionData | undefined;

    while (
      (data = this.nextCollision(
        Object.values(this.elements.balls),
        collisionables
      ))
    ) {
      const { collision, subject, target } = data;

      if (target instanceof VerticalPaddle && collision.ynormal === 0) {
        subject.team = target.team;
        this.elements.sounds.push(GameSound.PADDLE);
      }

      if (target instanceof HorizontalPaddle && collision.xnormal === 0) {
        subject.team = target.team;
        this.elements.sounds.push(GameSound.PADDLE);
      }

      if (target instanceof Wall) this.elements.sounds.push(GameSound.WALL);

      balls.forEach(b => b.move(collision.entryTime));
      paddles.forEach(p => p.move(collision.entryTime));

      if (target instanceof Paddle) {
        const angle = target.getOutputAngle(subject);

        const speed = Math.sqrt(subject.sx ** 2 + subject.sy ** 2);
        subject.sx = speed * Math.cos(angle);
        subject.sy = speed * Math.sin(angle);

        const velocity = Math.sqrt(subject.vx ** 2 + subject.vy ** 2);
        subject.vx = velocity * Math.cos(angle);
        subject.vy = velocity * Math.sin(angle);

        if (target instanceof HorizontalPaddle) {
          subject.sy *= -1;
          subject.vy *= -1;
        }
      } else {
        if (collision.xnormal != 0) {
          subject.vx *= -1;
          subject.sx *= -1;
        }

        if (collision.ynormal != 0) {
          subject.vy *= -1;
          subject.sy *= -1;
        }
      }

      subject.sx +=
        subject.sx < 0 ? -Math.abs(target.sx) / 10 : Math.abs(target.sx) / 10;
      subject.sy +=
        subject.sy < 0 ? -Math.abs(target.sy) / 10 : Math.abs(target.sy) / 10;

      subject.sx +=
        subject.sx < 0 ? -Math.abs(target.sx) / 10 : Math.abs(target.sx) / 10;
      subject.sy +=
        subject.sy < 0 ? -Math.abs(target.sy) / 10 : Math.abs(target.sy) / 10;
    }

    this.clear();
    balls.forEach(b => {
      b.move();
      this.draw(b);
    });
    paddles.forEach(p => {
      p.move();
      this.draw(p);
    });

    Object.values(this.elements.balls).forEach(b => this.applyScore(b));
  }

  private nextCollision(
    subjects: Array<Ball>,
    targets: Array<Rectangle>
  ): CollisionData | undefined {
    let data:
      | { collision: Collision; subject: Ball; target: Rectangle }
      | undefined;

    for (const s of subjects) {
      for (const t of targets) {
        const c = t.collision(s);

        if (!c || c.entryTime <= 0 || isNaN(c.entryTime)) continue;
        if (data && c.entryTime >= data.collision.entryTime) continue;

        data = { collision: c, subject: s, target: t };
      }
    }
    return data;
  }

  protected abstract applyScore(b: Ball): void;

  private draw(r: Rectangle) {
    this.context?.fillRect(r.x, r.y, r.w, r.h);
  }

  private clear() {
    this.context?.clearRect(0, 0, Game.w, Game.h);
  }

  public from(gameData: DeepPartial<GameData>) {
    this.mergeDeep(this.elements, gameData);
  }

  private mergeDeep(target: any, ...sources: Array<any>): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }

  private isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  public moveForward(player: string): void {
    this.elements.paddles[this.playerPaddle[player]]?.moveForward();
  }

  public moveBackward(player: string): void {
    this.elements.paddles[this.playerPaddle[player]]?.moveBackward();
  }

  public stopMovement(player: string): void {
    this.elements.paddles[this.playerPaddle[player]]?.stopMovement();
  }

  public abstract reset(): void;
}

export class Pong extends Game {
  public override reset(): void {
    this.elements = {
      teams: { LEFT: 0, RIGHT: 0 },
      balls: { a: new Ball() },
      paddles: {
        left: new LeftPaddle('LEFT', 1 * VerticalPaddle.w),
        right: new RightPaddle('RIGHT', Game.w - 2 * VerticalPaddle.w),
      },
      walls: {
        top: new Wall(-5, -5, Game.w + 10, 5),
        bottom: new Wall(-5, Game.h, Game.w + 10, 5),
      },
      sounds: [],
    };
    if (!this.context)
      Object.values(this.elements.balls).forEach(b => b.reset());
  }

  protected override applyScore(b: Ball): void {
    if (!b.outside && (b.x + b.w < 0 || b.x > Game.w)) {
      b.outside = true;
      this.elements.sounds.push(GameSound.SCORE);

      if (b.x + b.w < 0) this.elements.teams['RIGHT']++;

      if (b.x > Game.w) this.elements.teams['LEFT']++;

      if (!this.context)
        setTimeout(() => {
          b?.reset();
        }, 2000);
    }
  }
}

export class PongDouble extends Game {
  public override reset(): void {
    this.elements = {
      teams: { LEFT: 0, RIGHT: 0 },
      balls: { a: new Ball() },
      paddles: {
        left1: new LeftPaddle('LEFT', 1 * VerticalPaddle.w),
        left2: new LeftPaddle('LEFT', 3 * VerticalPaddle.w),
        right1: new RightPaddle('RIGHT', Game.w - 4 * VerticalPaddle.w),
        right2: new RightPaddle('RIGHT', Game.w - 2 * VerticalPaddle.w),
      },
      walls: {
        top: new Wall(-5, -5, Game.w + 10, 5),
        bottom: new Wall(-5, Game.h, Game.w + 10, 5),
      },
      sounds: [],
    };
    if (!this.context)
      Object.values(this.elements.balls).forEach(b => b.reset());
  }

  protected override applyScore(b: Ball): void {
    if (!b.outside && (b.x + b.w < 0 || b.x > Game.w)) {
      b.outside = true;
      this.elements.sounds.push(GameSound.SCORE);

      if (b.x + b.w < 0) this.elements.teams['RIGHT']++;

      if (b.x > Game.w) this.elements.teams['LEFT']++;

      if (!this.context)
        setTimeout(() => {
          b?.reset();
        }, 2000);
    }
  }
}

export class Quadrapong extends Game {
  public override reset(): void {
    this.elements = {
      teams: {
        LEFT: 0,
        RIGHT: 0,
        TOP: 0,
        BOTTOM: 0,
      },
      balls: { a: new Ball(), b: new Ball() },
      paddles: {
        left: new LeftPaddle('LEFT', 1 * VerticalPaddle.w),
        right: new RightPaddle('RIGHT', Game.w - 2 * VerticalPaddle.w),
        top: new TopPaddle('TOP', HorizontalPaddle.h),
        bottom: new BottomPaddle('BOTTOM', Game.h - 2 * HorizontalPaddle.h),
      },
      walls: {},
      sounds: [],
    };
    if (!this.context)
      Object.values(this.elements.balls).forEach(b => b.reset());
  }

  protected override applyScore(b: Ball): void {
    if (
      !b.outside &&
      (b.x + b.w < 0 || b.x > Game.w || b.y + b.h < 0 || b.y > Game.h)
    ) {
      b.outside = true;
      this.elements.sounds.push(GameSound.SCORE);

      if (b.team) {
        this.elements.teams[b.team]++;
        b.team = undefined;
      }

      if (b.x + b.w < 0) this.elements.teams['LEFT']--;

      if (b.x > Game.w) this.elements.teams['RIGHT']--;

      if (b.y + b.h < 0) this.elements.teams['TOP']--;

      if (b.y > Game.h) this.elements.teams['BOTTOM']--;

      if (!this.context)
        setTimeout(() => {
          b?.reset();
        }, 2000);
    }
  }
}
