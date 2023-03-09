import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { RoomService } from './room.service';
import { User } from '../entity/room.entity';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'room',
})
export class LobbyGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly tokenService: TokenService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);
      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;
      client.emit('game:room:list', this.roomService.getRooms());
    } catch (error) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('game:room:create')
  handleMessage(@ConnectedSocket() client: Socket, ...args: any[]) {
    const user = new User(client['subject'], client['subject']); // TODO: get name from user service
    const room = this.roomService.create(user);
    client.emit('game:room:info', room);
    client.nsp.emit('game:room:list', this.roomService.getRooms());
  }
}
