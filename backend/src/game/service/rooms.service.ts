import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { Server, Socket } from 'socket.io';
import { Dictionary } from '../entity/game.entity';
import { ClientSocket, Room, User } from '../entity/room.entity';
import { hideCircular } from '../helper/hide-server.replacer';
import { MatchHistoryService } from './match-history.service';

@Injectable()
export class RoomsService {
  server: Server;

  rooms: Dictionary<Room> = {};

  public constructor(public readonly historyService: MatchHistoryService) {}

  public roomCreate(client: ClientSocket): void {
    let id: string;
    do {
      id = randomBytes(10).toString('hex').substring(0, 6);
    } while (this.rooms[id]);

    this.rooms[id] = new Room(id, this.server, this, User.from(client));
    client.emit('game:room:create', id);
    setTimeout(() => this.deleteIfEmpty(id), 300000);
  }

  public roomQueueCreate(client: ClientSocket, client2 : ClientSocket): void {
    let id: string;
    do {
      id = randomBytes(10).toString('hex').substring(0, 6);
    } while (this.rooms[id]);

    this.rooms[id] = new Room(id, this.server, this, User.from(client));
    client.emit('game:room:create', id);
    client2.emit('game:room:create', id);
    setTimeout(() => this.deleteIfEmpty(id), 300000);
  }

  public deleteIfEmpty(id: string): void {
    if (this.rooms[id]?.isEmpty()) delete this.rooms[id];
  }

  public listNonEmptyRooms(client?: Socket): void {
    const rooms = Object.values(this.rooms).filter((room) => !room.isEmpty());
    if (client) client.emit('game:room:list', hideCircular(rooms));
    else this.server.emit('game:room:list', hideCircular(rooms));
  }
}
