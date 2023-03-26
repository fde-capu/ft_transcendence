import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { Dictionary } from '../entity/game.entity';
import { UserService } from 'src/user/service/user.service';
import { RoomsService } from '../service/rooms.service';
import { ClientSocket, User } from '../entity/room.entity';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: /rooms\/.+/,
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  clients: Dictionary<Socket> = {};

  public constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly roomsService: RoomsService,
  ) {}

  public async handleConnection(client: ClientSocket): Promise<void> {
    await this.authorize(client);
    /*client['logs'] = setInterval(
      () => client.emit('game:logs', client.id),
      1000,
    );*/
  }

  public handleDisconnect(client: ClientSocket): void {
    //clearInterval(client[`logs`]);
    const roomId = client['roomId'];
    // The socket is just disconnecting
    if (this.clients[client['subject']]?.id == client.id) {
      this.roomsService.rooms[roomId]?.disconnect(
        User.from(client as ClientSocket),
      );
      delete this.clients[client['subject']];
    }
    // The socket is being replaced with a new one and it has a different room
    else if (
      this.clients[client['subject']] &&
      roomId != this.clients[client['subject']]['room']
    )
      this.roomsService.rooms[roomId]?.leave(User.from(client));
  }

  @SubscribeMessage('game:room:status')
  public roomStatus(@ConnectedSocket() client: ClientSocket): void {
    this.roomsService.rooms[client['roomId']]?.sendStatus(client);
  }

  @SubscribeMessage('game:room:leave')
  public roomLeave(@ConnectedSocket() client: ClientSocket): void {
    this.roomsService.rooms[client['roomId']]?.leave(
      User.from(client as ClientSocket),
    );
    client.emit('game:erro', 'You left the room');
    client.disconnect();
  }

  /*@SubscribeMessage('game:player:ready')
  public playerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): void {
    throw new Error('Not implemented!');
  }*/

  private async authorize(client: ClientSocket): Promise<void> {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);

      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;

      const { name } = await this.userService.getUserByIntraId(subject);
      client['name'] = name;

      if (this.clients[subject] && this.clients[subject].id != client.id) {
        this.clients[subject].emit('game:error', 'You logged in elsewhere');
        this.clients[subject].disconnect();
      }

      this.clients[subject] = client;

      client['roomId'] = client.nsp.name.match(/rooms\/(?<id>.+)/).groups['id'];
      if (!this.roomsService.rooms[client['roomId']]) {
        client.emit('game:error', 'Room does not exist');
        client.disconnect();
        return;
      }

      this.roomsService.rooms[client['roomId']].server =
        client.nsp as unknown as Server;
      this.roomsService.rooms[client['roomId']]?.join(User.from(client));
    } catch (error) {
      client.emit('game:error', 'You are not authenticated!');
      client.disconnect(true);
    }
  }
}
