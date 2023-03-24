import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { UserService } from 'src/user/service/user.service';
import { ClientSocket, RoomService } from '../service/room.service';
import { Room, User } from '../entity/room.entity';
import { hideServer } from '../helper/hide-server.replacer';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: /game\/.+\/?$/,
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  room: Room;

  public constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  public async handleConnection(client: ClientSocket): Promise<void> {
    if (!this.room) {
      try {
        this.configureRoom(client);
      } catch (error) {
        return;
      }
    }

    await this.authorize(client);

    this.room.join(User.from(client));

    this.roomService.notifyRooms();
  }

  public handleDisconnect(client: ClientSocket): void {
    this.room.disconnect(User.from(client));

    setTimeout(() => {
      this.roomService.deleteIfEmpty(this.room.id);
    }, 5000);

    this.roomService.notifyRooms();
  }

  @SubscribeMessage('game:room:status')
  roomCreate(@ConnectedSocket() client: Socket) {
    if (!this.room)
      this.server.emit(
        'game:room:error',
        JSON.stringify({ message: 'The room is gone!' }, hideServer),
      );
    else client.emit('game:room:status', JSON.stringify(this.room, hideServer));
  }

  private async authorize(client: Socket): Promise<void> {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);
      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;
      try {
        const user = await this.userService.getUserByIntraId(subject);
        client['name'] = user.name;
      } catch (error) {
        client['name'] = subject;
      }
    } catch (error) {
      client.disconnect(true);
    }
  }

  private configureRoom(client: Socket): void {
    const roomId =
      client.nsp.name.match(/game\/(?<roomId>.+)$/).groups['roomId'];

    this.room = this.roomService.rooms[roomId];

    if (!this.room) {
      this.server.emit(
        'game:room:error',
        JSON.stringify({ message: 'The room is gone!' }, hideServer),
      );
      client.disconnect();
      throw new Error('The room is gone!');
    }

    this.room.server = this.server;
  }
}
