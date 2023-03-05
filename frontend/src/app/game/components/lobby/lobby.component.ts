import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { LobbySocket } from '../../socket/lobby.socket';

interface Room {
  id: string;
  mode: string;
  status: string;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnDestroy {
  lobbySocket: LobbySocket;

  rooms: Array<Room> = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.lobbySocket = new LobbySocket();
    this.lobbySocket
      .fromEvent<Array<Room>>('game:room:list')
      .pipe(tap(r => console.table(r)))
      .subscribe({ next: r => (this.rooms = r) });
  }

  ngOnDestroy(): void {
    this.lobbySocket.disconnect();
  }

  joinRoom(roomId: string): void {
    this.router.navigate([`./${roomId}`], { relativeTo: this.route });
  }

  createRoom(): void {
    this.lobbySocket.emit('game:room:create');
  }

  quickMatch(): void {
    if (this.rooms.length == 0) {
      this.createRoom();
      // TODO: redirect to the new room
    }
    throw new Error('Method not implemented.');
    // TODO: redirect to random room page or create one
  }
}
