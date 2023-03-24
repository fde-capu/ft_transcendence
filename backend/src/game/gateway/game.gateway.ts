import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { UserService } from 'src/user/service/user.service';
import { ClientSocket, RoomService } from '../service/room.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'game',
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  public constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  public afterInit(server: Server): void {
    this.roomService.server = server;
  }

  public async handleConnection(client: Socket): Promise<void> {
    await this.authorize(client);
  }

  @SubscribeMessage('game:room:list')
  public roomList(): void {
    this.roomService.notifyRooms();
  }

  @SubscribeMessage('game:room:create')
  roomCreate(@ConnectedSocket() client: Socket) {
    this.roomService.create(client as ClientSocket);
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
}
