import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  message$: Observable<any>;
  constructor(private readonly gameService: GameService) {
    this.message$ = this.gameService.getMessage();
  }
  send(value: string) {
    this.gameService.sendMessage(value);
  }
}
