import { Component } from '@angular/core';
import { map, tap } from 'rxjs';
import { GameSocket } from '../../socket/game.socket';

export interface Player {
  connected: true;
  id: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  players: Array<Player> = [];
  constructor(private readonly gameSocket: GameSocket) {
    this.gameSocket
      .fromEvent<{ [id: string]: Player }>('game:player:list')
      .pipe(
        tap(r => console.log(r)),
        map(r => Object.values(r))
      )
      .subscribe({
        next: p => {
          this.players = p;
        },
      });
  }
}
