import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../entity/room.entity';
import { GameSocket } from '../../socket/rooms.socket';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: Array<Room> = [];

  errorMessage?: string;
  errorHidden = true;

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

    if (history.state.error) {
      this.errorMessage = history.state.error;
      this.errorHidden = false;

      history.pushState({}, '', this.router.url);
    }
  }

  createRoom() {
    this.gameSocket.emit('game:room:create');
  }
}
