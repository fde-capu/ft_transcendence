import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomSocket } from '../../socket/room.socket';

interface Message {
  room: string;
  author: string;
  payload: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  rooms: Map<string, Socket> = new Map();

  messages: Array<Message> = [];

  send(value: string): void {
    for (const room of this.rooms.values()) {
      room.emit('message', value);
    }
  }

  join(roomId: string): void {
    if (this.rooms.has(roomId)) return;
    const room = new RoomSocket(roomId);
    room
      .fromEvent<Message>('message')
      .subscribe({ next: msg => (this.messages = [...this.messages, msg]) });
    this.rooms.set(roomId, room);
  }

  leave(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.disconnect();
    this.rooms.delete(roomId);
  }
}
