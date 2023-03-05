import { Injectable } from '@nestjs/common';
import { Room, User } from '../entity/room.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  public getRooms(): Array<Room> {
    return Array.from(this.rooms.values());
  }

  public create(host: User): Room {
    Array.from(this.rooms.values()).forEach((r) => this.leave(host, r.getId()));
    let id: string;
    do {
      id = this.randomString();
    } while (this.rooms.has(id));
    const room = new Room(id);
    this.rooms.set(id, room);
    return room;
  }

  public join(user: User, roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found!');
    room.join(user);
  }

  public leave(user: User, roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.leave(user);
    if (!room.getHost()) this.rooms.delete(roomId);
  }

  private randomString(): string {
    return randomBytes(10).toString('hex').substring(0, 6);
  }
}
