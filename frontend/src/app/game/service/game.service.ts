import { Injectable } from '@angular/core';
import { GameSocket } from '../socket/game.socket';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private readonly socket: GameSocket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent<any>('message');
  }
}
