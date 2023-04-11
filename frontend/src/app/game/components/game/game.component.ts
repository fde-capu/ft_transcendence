import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { Game, GameData, Pong, Dictionary, PongDouble, Quadrapong } from '../../entity/game.entity';
import { GameMode, Room } from '../../entity/room.entity';
import { RoomSocket } from '../../socket/room.socket';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('stage')
  canvas!: ElementRef<HTMLCanvasElement>;

  @Input() roomSocket!: RoomSocket;

  @Input() room!: Room;

  game!: Game;

  score: Dictionary<number> = {};

  sounds = [
    new Audio('/assets/sounds/paddle.mp3'),
    new Audio('/assets/sounds/wall.mp3'),
    new Audio('/assets/sounds/score.mp3'),
  ];
  
  ngAfterViewInit(): void {
    switch (this.room.mode) {
      case GameMode.PONG:
        this.game = new Pong(this.canvas.nativeElement);
        break;
      case GameMode.PONGDOUBLE:
        this.game = new PongDouble(this.canvas.nativeElement);
        break;
      case GameMode.QUADRAPONG:
        this.game = new Quadrapong(this.canvas.nativeElement);
        break;
    }
    this.game.reset();

    let gd: GameData | undefined;
    this.roomSocket.fromEvent<GameData>('game:status').subscribe({
      next: status => {
        gd = status;
        this.score = status.teams;
        status.sounds.forEach(sound => this.sounds[sound].play());
      },
    });

    const frameRate = 1000 / 60;
    let lastUpdate = Date.now();
    const render = () => {
      if (gd) this.game.from(gd);
      gd = undefined;
      const currentTimestamp = Date.now();
      this.game.update((currentTimestamp - lastUpdate) / 1000);
      lastUpdate = currentTimestamp;
      setTimeout(() => {
        window.requestAnimationFrame(render);
      }, frameRate);
    };
    window.requestAnimationFrame(render);
  }

  @HostListener('window:keydown', ['$event'])
  move(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.roomSocket.emit('game:player:move:backward');
        break;
      case 'ArrowLeft':
        this.roomSocket.emit('game:player:move:backward');
        break;
      case 'ArrowDown':
        this.roomSocket.emit('game:player:move:forward');
        break;
      case 'ArrowRight':
        this.roomSocket.emit('game:player:move:forward');
        break;
      case 'KeyW':
        this.roomSocket.emit('game:player:move:backward');
        break;
      case 'KeyA':
        this.roomSocket.emit('game:player:move:backward');
        break;
      case 'KeyS':
        this.roomSocket.emit('game:player:move:forward');
        break;
      case 'KeyD':
        this.roomSocket.emit('game:player:move:forward');
    }
  }

  @HostListener('window:keyup', ['$event'])
  stop(): void {
    this.roomSocket.emit('game:player:move:stop');
  }

  getTeamScore(teamId: string): number {
    return this.score[teamId] || 0;
  }
}
