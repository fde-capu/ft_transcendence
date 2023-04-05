import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { Dictionary } from '../entity/game.entity';
import { UserService } from 'src/user/service/user.service';
import { RoomsService } from '../service/rooms.service';
import { ClientSocket, GameMode, User } from '../entity/room.entity';
import { environment } from 'src/environment';

@WebSocketGateway({
  cors: { origin: environment.FRONTEND_ORIGIN, credentials: true },
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
    try {
      const { authorization } = parse(client.handshake.headers.cookie);

      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;

      const { name, image } = await this.userService.getUserByIntraId(subject);
      client['name'] = name;
			client['image'] = image;
      client['roomId'] = client.nsp.name.match(/rooms\/(?<id>.+)/).groups['id'];
      if (!this.roomsService.rooms[client['roomId']]) {
        client.emit('game:error', 'Room does not exist.');
        client.disconnect();
        return;
      }

      const oldClient = this.clients[subject];
      this.clients[subject] = client;

      if (oldClient && oldClient.id != client.id) {
        oldClient.emit('game:error', 'You logged in elsewhere');
        oldClient.disconnect();
      }

      this.roomsService.rooms[client['roomId']].server =
        client.nsp as unknown as Server;
      this.roomsService.rooms[client['roomId']]?.join(User.from(client));
    } catch (error) {
      client.emit('game:error', 'You are not authenticated!');
      client.disconnect(true);
    }
  }

  public handleDisconnect(client: ClientSocket): void {
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
      roomId != this.clients[client['subject']]['roomId']
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
    client.emit('game:room:leave');
    delete this.clients[client['subject']];
    client.disconnect();
  }

  @SubscribeMessage('game:room:mode')
  public roomMode(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() mode: GameMode,
  ): void {
    const room = this.roomsService.rooms[client['roomId']];
    if (room?.host?.id == client['subject']) room?.setMode(mode);
  }

  @SubscribeMessage('game:player:ready')
  public playerReady(@ConnectedSocket() client: ClientSocket): void {
    this.roomsService.rooms[client['roomId']]?.ready(
      User.from(client as ClientSocket),
    );
  }

  @SubscribeMessage('game:player:move:forward')
  public playerMoveForward(@ConnectedSocket() client: ClientSocket): void {
    this.roomsService.rooms[client['roomId']]?.moveForward(
      User.from(client as ClientSocket),
    );
  }

  @SubscribeMessage('game:player:move:backward')
  public playerMoveBackward(@ConnectedSocket() client: ClientSocket): void {
    this.roomsService.rooms[client['roomId']]?.moveBackward(
      User.from(client as ClientSocket),
    );
  }

  @SubscribeMessage('game:player:move:stop')
  public playerStopMovement(@ConnectedSocket() client: ClientSocket): void {
    this.roomsService.rooms[client['roomId']]?.stopMovement(
      User.from(client as ClientSocket),
    );
  }
}
