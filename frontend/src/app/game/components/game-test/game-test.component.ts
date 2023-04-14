import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Game, Dictionary, Quadrapong } from '../../entity/game.entity';

@Component({
  selector: 'app-game-test',
  templateUrl: './game-test.component.html',
  styleUrls: ['./game-test.component.css'],
})
export class GameTestComponent implements AfterViewInit {
  @ViewChild('stage')
  canvas!: ElementRef<HTMLCanvasElement>;

  game!: Game;

  score: Dictionary<number> = {};

  sounds = [
    new Audio('/assets/sounds/paddle.mp3'),
    new Audio('/assets/sounds/wall.mp3'),
    new Audio('/assets/sounds/score.mp3'),
  ];

  ngAfterViewInit(): void {
    this.game = new Quadrapong(this.canvas.nativeElement);
    this.game.reset();
    Object.values(this.game.elements.balls).forEach(b => b.reset());

    const frameRate = 1000 / 60;
    let lastUpdate = Date.now();
    const render = () => {
      const currentTimestamp = Date.now();
      this.game.update((currentTimestamp - lastUpdate) / 1000);
      Object.values(this.game.elements.balls)
        .filter(b => b.outside)
        .forEach(b => b.reset());
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
        this.game.elements.paddles['top'].moveBackward();
        break;
      case 'ArrowLeft':
        this.game.elements.paddles['top'].moveBackward();
        break;
      case 'ArrowDown':
        this.game.elements.paddles['top'].moveForward();
        break;
      case 'ArrowRight':
        this.game.elements.paddles['top'].moveForward();
        break;
      case 'KeyW':
        this.game.elements.paddles['top'].moveBackward();
        break;
      case 'KeyA':
        this.game.elements.paddles['top'].moveBackward();
        break;
      case 'KeyS':
        this.game.elements.paddles['top'].moveForward();
        break;
      case 'KeyD':
        this.game.elements.paddles['top'].moveForward();
    }
  }

  @HostListener('window:keyup', ['$event'])
  stop(): void {
    this.game.elements.paddles['top'].stopMovement();
  }
}
