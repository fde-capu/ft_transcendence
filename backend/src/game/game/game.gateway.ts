import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';

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

  public constructor(private readonly tokenService: TokenService) {}

  public afterInit(server: Server): void {}

  public async handleConnection(client: Socket): Promise<void> {}

  public handleDisconnect(client: Socket): void {}

  private async authorize(client: Socket): Promise<void> {
    try {
      console.log('game handleConnection');
      const { authorization } = parse(client.handshake.headers.cookie);
      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;
    } catch (error) {
      client.disconnect(true);
    }
  }
}
