import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Dictionary } from '../entity/game.entity';
import { Room, User } from '../entity/room.entity';
import { randomBytes } from 'crypto';
import { hideServer } from '../helper/hide-server.replacer';

export type ClientSocket = Socket & {
  subject: string;
  name: string;
};

@Injectable()
export class RoomService {
  private readonly logger = new Logger('RoomService');

  public server: Server;

  public rooms: Dictionary<Room> = {};

  public create(client: ClientSocket): void {
    // Create new room
    let id: string;
    do {
      id = this.randomString();
    } while (this.rooms[id]);
    this.rooms[id] = new Room(id, User.from(client));
    this.rooms[id].server = this.server.to(id);
    this.rooms[id].service = this;

    this.logger.log(`New room: ${id}`);

    // Join user
    client.emit('game:room:status', JSON.stringify(this.rooms[id], hideServer));
    this.notifyRooms();
  }

  private randomString(): string {
    return randomBytes(10).toString('hex').substring(0, 6);
  }

  public deleteIfEmpty(roomId: string): void {
    if (this.rooms[roomId]) {
      delete this.rooms[roomId];
      this.logger.log(`Room closed: ${roomId}`);
      this.notifyRooms();
    }
  }

  public notifyRooms(): void {
    const rooms = Object.values(this.rooms).filter((r) => !r.isEmpty());

    this.server.emit('game:room:list', JSON.stringify(rooms, hideServer));
  }

  public join(client: ClientSocket, roomId: string): void {
    const user = User.from(client);

    Object.values(this.rooms)
      .filter(
        (r) => r.getUsers().find((u) => u.id == user.id) && r.id != roomId,
      )
      .forEach((r) => {
        client.leave(r.id);
        r.leave(user);
        this.deleteIfEmpty(r.id);
      });

    const room = this.rooms[roomId];
    if (!room) {
      client.emit('game:room:error', { message: 'The room is gone!' });
      return;
    }

    client.join(roomId);
    room.join(user);

    this.notifyRooms();
  }

  public leave(client: ClientSocket): void {
    const user = User.from(client);

    Object.values(this.rooms)
      .filter((r) => r.getUsers().find((u) => u.id == user.id))
      .forEach((r) => {
        client.leave(r.id);
        r.leave(user);
        this.deleteIfEmpty(r.id);
      });

    this.notifyRooms();
  }

  public connect(client: ClientSocket): void {
    const user = User.from(client);

    const room = Object.values(this.rooms).find((r) =>
      r.getUsers().find((u) => u.id == user.id),
    );

    if (room) {
      client.join(room.id);
      room.join(user);
    }
  }

  public disconnect(client: ClientSocket): void {
    const user = User.from(client);

    Object.values(this.rooms)
      .filter((r) => r.getUsers().find((u) => u.id == user.id))
      .forEach((r) => {
        client.leave(r.id);
        r.disconnect(user);
      });
  }
}
