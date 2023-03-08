import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Single } from './engine';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('game')
  canvas!: ElementRef<HTMLCanvasElement>;

  running = false;

  ngAfterViewInit(): void {
    const game = new Single(this.canvas.nativeElement);
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
}
