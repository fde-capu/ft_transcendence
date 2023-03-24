import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Dictionary } from '../entity/game.entity';
import { Room, User } from '../entity/room.entity';
import { randomBytes } from 'crypto';
import { hideServer } from '../helper/hide-server.replacer';

export type ClientSocket = Socket & { subject: string; name: string };

@Injectable()
export class RoomService {
  public server: Server;

  public rooms: Dictionary<Room> = {};

  public create(client: ClientSocket): void {
    // Create new room
    let id: string;
    do {
      id = this.randomString();
    } while (this.rooms[id]);
    this.rooms[id] = new Room(id, User.from(client));

    // Notify new room
    this.notifyRooms();
    client.emit('game:room:status', JSON.stringify(this.rooms[id], hideServer));

    // Delete the room if no one enters the room within 5 seconds
    setTimeout(() => this.deleteIfEmpty(id), 5000);
  }

  public notifyRooms(): void {
    const rooms = Object.keys(this.rooms).reduce((a, b) => {
      if (!this.rooms[b].isEmpty()) a[b] = this.rooms[b];
      return a;
    }, {});

    this.server.emit('game:room:list', JSON.stringify(rooms, hideServer));
  }

  public deleteIfEmpty(roomId: string): void {
    if (this.rooms[roomId]?.isEmpty()) delete this.rooms[roomId];
    this.notifyRooms();
  }

  private randomString(): string {
    return randomBytes(10).toString('hex').substring(0, 6);
  }
}
