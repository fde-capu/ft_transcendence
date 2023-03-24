import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { Dictionary } from '../../entity/game.entity';
import { Room } from '../../entity/room.entity';
import { GameSocket } from '../../socket/game.socket';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  rooms: Array<Room> = [];

  constructor(
    private readonly gameSocket: GameSocket,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.gameSocket
      .fromEvent<string>('game:room:list')
      .pipe(
        map(str => JSON.parse(str) as Dictionary<Room>),
        map(d => Object.values(d)),
        tap(r => console.table(r))
      )
      .subscribe({ next: r => (this.rooms = r) });

    this.gameSocket
      .fromEvent<string>('game:room:status')
      .pipe(map(str => JSON.parse(str) as Room))
      .subscribe({
        next: r =>
          this.router.navigate([`./${r.id}`], { relativeTo: this.route }),
      });
  }

  ngOnInit(): void {
    this.gameSocket.emit('game:room:list');
  }

  createRoom() {
    this.gameSocket.emit('game:room:create');
  }
}
