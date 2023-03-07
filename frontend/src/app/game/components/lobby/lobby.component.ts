import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      .subscribe({ next: r => (this.rooms = r) });

    this.lobbySocket
      .fromEvent<Room>('game:room:info')
      .subscribe({ next: r => this.joinRoom(r.id) });
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
    throw new Error('Method not implemented.');
    // TODO: redirect to random room page or create one
  }
}
