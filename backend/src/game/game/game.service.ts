import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export class Player {
  public connected = true;
  public constructor(public readonly id: string) {}
}

export type Client = Socket & { subject: string };

@Injectable()
export class GameService {
  private server?: Server;

  private players: { [id: string]: Player } = {};

  public setServer(server: Server): void {
    this.server = server;
  }

  public connect(client: Client): void {
    let player = this.players[client.subject];

    if (!player)
      player = this.players[client.subject] = new Player(client.subject);

    player.connected = true;

    this.emit('game:player:list', this.players);
  }

  public disconnect(client: Client): void {
    const player = this.players[client.subject];

    if (!player) return;

    player.connected = false;

    this.emit('game:player:list', this.players);
  }

  private emit(event: string, data: any): void {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    const result = JSON.parse(JSON.stringify(data, getCircularReplacer()));

    this.server.emit(event, result);
  }
}
