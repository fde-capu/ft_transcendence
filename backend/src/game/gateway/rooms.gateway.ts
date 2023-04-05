import {
  WebSocketGateway,
  OnGatewayConnection,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { RoomsService } from '../service/rooms.service';
import { ClientSocket } from '../entity/room.entity';
import { UserService } from 'src/user/service/user.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'rooms',
})
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection {
  public constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly roomsService: RoomsService,
  ) {}

  public afterInit(server: Server): void {
    this.roomsService.server = server;
  }

  public async handleConnection(client: Socket): Promise<void> {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);

      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;

      const { name, image } = await this.userService.getUserByIntraId(subject);
      client['name'] = name;
      client['image'] = image;
    } catch (error) {
      client.emit('game:error', 'You are not authenticated!');
      client.disconnect(true);
    }
  }

  @SubscribeMessage('game:room:list')
  public roomList(@ConnectedSocket() client: Socket): void {
    this.roomsService.listNonEmptyRooms(client);
  }

  @SubscribeMessage('game:room:create')
  public roomCreate(@ConnectedSocket() client: Socket): void {
    this.roomsService.roomCreate(client as ClientSocket);
  }
}
