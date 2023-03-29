import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { Game, GameData, Pong } from '../../entity/game.entity';
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

  mode!: GameMode;

  game!: Game;

  running = false;

  ngAfterViewInit(): void {
    let gd: GameData | undefined;
    this.roomSocket
      .fromEvent<GameData>('game:status')
      .subscribe({ next: msg => (gd = msg) });
    this.game = new Pong(this.canvas.nativeElement);
    this.game.reset();

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
    this.running = true;
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
    }
  }

  @HostListener('window:keyup', ['$event'])
  stop(): void {
    this.roomSocket.emit('game:player:move:stop');
  }

  @HostListener('document:visibilitychange', ['$event'])
  tanana(event: Event): void {
    console.log(document.hidden);
  }
}
