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

interface Room {
  id: string;
  mode: string;
  status: string;
}

let rooms: Array<Room> = [
  {
    id: 'xpto',
    mode: 'Pong',
    status: 'In Game',
  },
  {
    id: 'abcd',
    mode: 'Pong',
    status: 'Waiting',
  },
];

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'room',
})
export class LobbyGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tokenService: TokenService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);
      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;
      client.emit('room:list', rooms);
    } catch (error) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('room:create')
  handleMessage(@ConnectedSocket() client: Socket, ...args: any[]) {
    rooms = [...rooms, { id: '123456', mode: 'Pong', status: 'waiting' }];
    this.server.emit('room:list', rooms);
  }
}
