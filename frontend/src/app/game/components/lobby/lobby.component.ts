import { Component } from '@angular/core';
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
export class LobbyComponent {
  lobby: LobbySocket;

  rooms: Array<Room> = [];

  constructor() {
    this.lobby = new LobbySocket();
    this.lobby
      .fromEvent<Array<Room>>('room:list')
      .subscribe({ next: r => (this.rooms = r) });
  }

  joinRoom(roomId: string): void {
    throw new Error('Method not implemented.');
    // TODO: redirect to the room page
  }

  createRoom(): void {
    this.lobby.emit('room:create');
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
