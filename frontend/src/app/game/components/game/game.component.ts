import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { PongDouble } from './engine';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('stage')
  canvas!: ElementRef<HTMLCanvasElement>;

  running = false;

  value = 0;

  ngAfterViewInit(): void {
    const game = new PongDouble(this.canvas.nativeElement);
    game.reset();
    const frameRate = 1000 / 60;
    let lastUpdate = Date.now();
    function render() {
      const currentTimestamp = Date.now();
      game.update((currentTimestamp - lastUpdate) / 1000);
      lastUpdate = currentTimestamp;
      setTimeout(() => {
        window.requestAnimationFrame(render);
      }, frameRate);
    }
    window.requestAnimationFrame(render);
  }

  @HostListener('window:keyup', ['$event'])
  increment(event: KeyboardEvent): void {
    console.dir(event);
    this.value++;
  }

  @HostListener('document:visibilitychange', ['$event'])
  tanana(event: Event): void {
    console.log(document.hidden);
    this.value++;
  }
}
