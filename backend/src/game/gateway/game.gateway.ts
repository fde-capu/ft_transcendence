import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayDisconnect,
  MessageBody,
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
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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

  public async handleConnection(client: ClientSocket): Promise<void> {
    await this.authorize(client);
    this.roomService.connect(client);
  }

  handleDisconnect(client: ClientSocket) {
    this.roomService.disconnect(client);
  }

  @SubscribeMessage('game:room:status')
  public roomStatus(@ConnectedSocket() client: ClientSocket): void {
    this.roomService.connect(client);
  }

  @SubscribeMessage('game:room:list')
  public roomList(): void {
    this.roomService.notifyRooms();
  }

  @SubscribeMessage('game:room:create')
  roomCreate(@ConnectedSocket() client: ClientSocket) {
    this.roomService.create(client);
  }

  @SubscribeMessage('game:room:join')
  roomJoin(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() roomId: string,
  ) {
    this.roomService.join(client, roomId);
  }

  @SubscribeMessage('game:room:leave')
  roomLeave(@ConnectedSocket() client: ClientSocket) {
    this.roomService.leave(client);
  }

  @SubscribeMessage('game:room:disconnect')
  roomDisconnect(@ConnectedSocket() client: ClientSocket) {
    this.roomService.disconnect(client);
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
