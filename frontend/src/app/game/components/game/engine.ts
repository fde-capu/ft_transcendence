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

  public move(elements: Rectangle[]) {
    this.x += this.vx;
    this.y += this.vy;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Wall extends Rectangle {
  public constructor(x = 0, y = 0, w = 0, h = 0) {
    super(x, y, w, h);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public override draw() {}
}

class Ball extends Rectangle {
  static s = 10;

  public constructor(w = 0, h = 0, sx = 0, sy = 0) {
    super(w / 2 - Ball.s / 2, h / 2 - Ball.s / 2, Ball.s, Ball.s, 0, 0, sx, sy);
  }

  public override move(elements: Rectangle[]) {
    while (true) {
      const result = elements
        .map(element => ({
          element,
          collision: element.collision(this),
        }))
        .filter(r => !!r.collision)
        .sort((a, b) =>
          (a.collision?.entryTime || 0) < (b.collision?.entryTime || 0) ? -1 : 1
        )[0];

      if (!result) break;

      const { element, collision } = result;

      if (!element || !collision) break;

      this.sx += element.vx / 2;
      this.sy += element.vy / 2;

      this.x += this.vx * collision.entryTime;
      this.y += this.vy * collision.entryTime;

      const remainingtime = 1 - collision.entryTime;
      this.vx *= remainingtime;
      this.vy *= remainingtime;

      if (collision.xnormal != 0) {
        this.vx *= -1;
        this.sx *= -1;
      }

      if (collision.ynormal != 0) {
        this.vy *= -1;
        this.sy *= -1;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

class Paddle extends Rectangle {
  static shortSide = 15;
  static longSide = 50;

  protected l: number;

  public constructor(x = 0, y = 0, w = 0, h = 0, l = 0) {
    super(x, y, w, h);
    this.l = l;
  }
}

class VerticalPaddle extends Paddle {
  static w = Paddle.shortSide;
  static h = Paddle.longSide;

  public constructor(x = 0, h = 0) {
    super(
      x,
      h / 2 - VerticalPaddle.h / 2,
      VerticalPaddle.w,
      VerticalPaddle.h,
      h
    );
  }

  public override move(elements: Rectangle[]) {
    if (this.y + this.vy < 0) {
      this.y = 0;
    } else if (this.y + this.h + this.vy > this.l) {
      this.y = this.l - this.h;
    } else {
      this.y += this.vy;
    }
  }
}

class LeftPaddle extends VerticalPaddle {
  public constructor(x = 0, h = 0) {
    super(x, h);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vx > 0) return;
    return c;
  }
}

class RightPaddle extends VerticalPaddle {
  public constructor(x = 0, h = 0) {
    super(x, h);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vx < 0) return;
    return c;
  }
}

class HorizontalPaddle extends Paddle {
  static w = Paddle.longSide;
  static h = Paddle.shortSide;

  public constructor(y = 0, w = 0) {
    super(
      w / 2 - HorizontalPaddle.w / 2,
      y,
      HorizontalPaddle.w,
      HorizontalPaddle.h,
      w
    );
  }

  public override move() {
    if (this.x + this.vx < 0) {
      this.x = 0;
    } else if (this.x + this.w + this.vx > this.l) {
      this.x = this.l - this.w;
    } else {
      this.x += this.vx;
    }
  }
}

class TopPaddle extends HorizontalPaddle {
  public constructor(y = 0, w = 0) {
    super(y, w);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vy > 0) return;
    return c;
  }
}

class BottomPaddle extends HorizontalPaddle {
  public constructor(y = 0, w = 0) {
    super(y, w);
  }

  public override collision(b: Rectangle) {
    const c = super.collision(b);
    if (!c || b.vy < 0) return;
    return c;
  }
}

export abstract class Game {
  static w = 500;
  static h = 500;

  protected context: CanvasRenderingContext2D;

  protected elements: { [element: string]: Rectangle } = {};

  constructor(canvas: HTMLCanvasElement) {
    canvas.width = Game.w;
    canvas.height = Game.h;

    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!this.context) throw new Error('Canvas is not supported!');

    this.context.fillStyle = 'white';
  }

  update(t = 1) {
    const elements = Object.entries(this.elements).map(e => e[1]);

    elements.forEach(e => e.setVelocity(t));

    elements.forEach(e => e.move(elements));

    this.context.clearRect(0, 0, Pong.w, Pong.h);
    elements.forEach(e => e.draw(this.context));
  }

  public abstract reset(): void;
}

export class Pong extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      a: new Ball(Pong.w, Pong.h, 300, -200),
      b: new Wall(-5, -5, Pong.w + 10, 5),
      c: new Wall(-5, Pong.h, Pong.w + 10, 5),
      d: new LeftPaddle(1 * VerticalPaddle.w, Pong.h),
      e: new RightPaddle(Pong.w - 2 * VerticalPaddle.w, Pong.h),
    };
  }
}

export class PongDouble extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      a: new Ball(Pong.w, Pong.h, 300, -200),
      b: new Wall(-5, -5, Pong.w + 10, 5),
      c: new Wall(-5, Pong.h, Pong.w + 10, 5),
      d: new LeftPaddle(1 * VerticalPaddle.w, Pong.h),
      e: new LeftPaddle(3 * VerticalPaddle.w, Pong.h),
      f: new RightPaddle(Pong.w - 4 * VerticalPaddle.w, Pong.h),
      g: new RightPaddle(Pong.w - 2 * VerticalPaddle.w, Pong.h),
    };
  }
}

export class Quadrapong extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      a: new Ball(Pong.w, Pong.h, 300, -200),
      b: new LeftPaddle(1 * VerticalPaddle.w, Pong.h),
      c: new RightPaddle(Pong.w - 2 * VerticalPaddle.w, Pong.h),
      d: new TopPaddle(HorizontalPaddle.h, Pong.w),
      e: new BottomPaddle(Pong.h - 2 * HorizontalPaddle.h, Pong.w),
    };
  }
}

export class Single extends Game {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  public override reset(): void {
    this.elements = {
      a: new Ball(Pong.w, Pong.h, 300, -200),
      b: new Wall(-5, -5, 5, Pong.h + 10),
      c: new Wall(Pong.w, -1, 5, Pong.h + 10),
      d: new Wall(-5, -5, Pong.w + 10, 5),
      e: new Wall(-5, Pong.h, Pong.w + 10, 5),
    };
  }
}
