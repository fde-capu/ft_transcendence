import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Room } from '../../entity/room.entity';
import { GameSocket } from '../../socket/rooms.socket';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: Array<Room> = [];

  constructor(
    private readonly gameSocket: GameSocket,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.gameSocket
      .fromEvent<Array<Room>>('game:room:list')
      .subscribe({ next: r => (this.rooms = r) });

    this.gameSocket.fromEvent<string>('game:room:create').subscribe({
      next: id => this.router.navigate([`./${id}`], { relativeTo: this.route }),
    });
  }

  ngOnInit(): void {
    this.gameSocket.emit('game:room:list');
  }

  createRoom() {
    this.gameSocket.emit('game:room:create');
  }
}
