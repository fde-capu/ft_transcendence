import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  messages: { author: string; payload: string }[] = [];
  constructor(private readonly gameService: GameService) {
    this.gameService.getMessage().subscribe({
      next: msg => {
        console.log(msg);
        this.messages = [...this.messages, msg];
      },
    });
  }
  send(value: string) {
    this.gameService.sendMessage(value);
  }
}
