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
import { Client, GameService } from './game.service';

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
    private readonly gameService: GameService,
  ) {}

  public afterInit(server: Server): void {
    this.gameService.setServer(server);
  }

  public async handleConnection(client: Client): Promise<void> {
    await this.authorize(client);
    this.gameService.connect(client);
  }

  public handleDisconnect(client: Client): void {
    this.gameService.disconnect(client);
  }

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
