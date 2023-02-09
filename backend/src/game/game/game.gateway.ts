import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'game',
})
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tokenService: TokenService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);
      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;
      client.emit('message', {
        author: 'ft_transcendence',
        payload: 'Welcome!',
      });
    } catch (error) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    this.server.emit('message', {
      author: client['subject'],
      payload: payload,
    });
  }
}
