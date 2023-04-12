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
    const a000 = 0;
    const a030 = (Math.PI * 1) / 6;

    const a060 = (Math.PI * 1) / 3;
    const a120 = (Math.PI * 2) / 3;

    const a150 = (Math.PI * 5) / 6;
    const a210 = (Math.PI * 7) / 6;

    const a240 = (Math.PI * 4) / 3;
    const a300 = (Math.PI * 5) / 3;

    const a330 = (Math.PI * 11) / 6;
    const a360 = Math.PI * 2;

    let alpha: number;
    do {
      alpha = Math.PI * 2 * Math.random();
    } while (
      (a000 <= alpha && alpha <= a030) ||
      (a060 <= alpha && alpha <= a120) ||
      (a150 <= alpha && alpha <= a210) ||
      (a240 <= alpha && alpha <= a300) ||
      (a330 <= alpha && alpha <= a360)
    );

    this.sx = 300 * Math.cos(alpha);
    this.sy = 300 * Math.sin(alpha);

    console.log(alpha * (180 / Math.PI));
  }
}

abstract class Paddle extends Rectangle {
  static shortSide = 15;
  static longSide = 50;

  public constructor(x = 0, y = 0, w = 0, h = 0) {
    super(x, y, w, h);
  }
}

abstract class VerticalPaddle extends Paddle {
  static w = Paddle.shortSide;
  static h = Paddle.longSide;

  public constructor(x = 0) {
    super(
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
}

class LeftPaddle extends VerticalPaddle {
  public constructor(x = 0) {
    super(x);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vx > 0) return;
    return c;
  }
}

class RightPaddle extends VerticalPaddle {
  public constructor(x = 0) {
    super(x);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vx < 0) return;
    return c;
  }
}

abstract class HorizontalPaddle extends Paddle {
  static w = Paddle.longSide;
  static h = Paddle.shortSide;

  public constructor(y = 0) {
    super(
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
}

class TopPaddle extends HorizontalPaddle {
  public constructor(y = 0) {
    super(y);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vy > 0) return;
    return c;
  }
}

class BottomPaddle extends HorizontalPaddle {
  public constructor(y = 0) {
    super(y);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vy < 0) return;
    return c;
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
  running: boolean;
}

export abstract class Game {
  static w = 500;
  static h = 500;

  protected context: CanvasRenderingContext2D;

  public elements: GameData = {
    teams: {},
    balls: {},
    paddles: {},
    walls: {},
    sounds: [],
    running: false,
  };

  constructor(canvas: HTMLCanvasElement) {
    canvas.width = Game.w;
    canvas.height = Game.h;

    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!this.context) throw new Error('Canvas is not supported!');

    this.context.fillStyle = 'white';
  }

  update(t = 1) {
    if (!this.elements.running) return;

    const balls = Object.values(this.elements.balls);
    const paddles = Object.values(this.elements.paddles);
    const walls = Object.values(this.elements.walls);

    balls.forEach(b => b.setVelocity(t));
    paddles.forEach(p => p.setVelocity(t));

    const collisionables: Array<Rectangle> = [...paddles, ...walls];

    let data;

    while (
      (data = this.nextCollision(
        Object.values(this.elements.balls),
        collisionables
      ))
    ) {
      const { collision, subject, target } = data;

      subject.sx += target.vx / 2;
      subject.sy += target.vy / 2;

      balls.forEach(b => b.move(collision.entryTime));
      paddles.forEach(p => p.move(collision.entryTime));

      if (collision.xnormal != 0) {
        subject.vx *= -1;
        subject.sx *= -1;
      }

      if (collision.ynormal != 0) {
        subject.vy *= -1;
        subject.sy *= -1;
      }
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

    Object.values(this.elements.balls).forEach(b => {
      if (
        !b.outside &&
        (b.x + b.w < 0 || b.x > Game.w || b.y + b.h < 0 || b.y > Game.h)
      ) {
        b.outside = true;
        if (b.team) {
          this.elements.teams[b.team]++;
          b.team = undefined;
        }
      }
    });
  }

  private nextCollision(subjects: Array<Ball>, targets: Array<Rectangle>) {
    let data:
      | { collision: Collision; subject: Ball; target: Rectangle }
      | undefined;

    for (const s of subjects) {
      for (const t of targets) {
        const c = t.collision(s);

        if (!c) continue;
        if (data && c.entryTime >= data.collision.entryTime) continue;

        data = { collision: c, subject: s, target: t };
      }
    }
    return data;
  }

  private draw(r: Rectangle) {
    this.context.fillRect(r.x, r.y, r.w, r.h);
  }

  private clear() {
    this.context.clearRect(0, 0, Game.w, Game.h);
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

  public abstract reset(): void;
}

export class Pong extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      teams: { left: 0, right: 0 },
      balls: { a: new Ball() },
      paddles: {
        left: new LeftPaddle(1 * VerticalPaddle.w),
        right: new RightPaddle(Game.w - 2 * VerticalPaddle.w),
      },
      walls: {
        top: new Wall(-5, -5, Game.w + 10, 5),
        bottom: new Wall(-5, Game.h, Game.w + 10, 5),
      },
      sounds: [],
      running: true,
    };
  }
}

export class PongDouble extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      teams: { left: 0, right: 0 },
      balls: { a: new Ball() },
      paddles: {
        left1: new LeftPaddle(1 * VerticalPaddle.w),
        left2: new LeftPaddle(3 * VerticalPaddle.w),
        right1: new RightPaddle(Game.w - 4 * VerticalPaddle.w),
        right2: new RightPaddle(Game.w - 2 * VerticalPaddle.w),
      },
      walls: {
        top: new Wall(-5, -5, Game.w + 10, 5),
        bottom: new Wall(-5, Game.h, Game.w + 10, 5),
      },
      sounds: [],
      running: true,
    };
  }
}

export class Quadrapong extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      teams: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      balls: { a: new Ball() },
      paddles: {
        left: new LeftPaddle(1 * VerticalPaddle.w),
        right: new RightPaddle(Game.w - 2 * VerticalPaddle.w),
        top: new TopPaddle(HorizontalPaddle.h),
        bottom: new BottomPaddle(Game.h - 2 * HorizontalPaddle.h),
      },
      walls: {},
      sounds: [],
      running: true,
    };
  }
}
