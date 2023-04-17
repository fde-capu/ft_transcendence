import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { environment } from 'src/environment';
import { Logger } from '@nestjs/common';
import { UserService } from '../service/user.service';

@WebSocketGateway({
  cors: { origin: environment.FRONTEND_ORIGIN, credentials: true },
  cookie: true,
  namespace: 'online',
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  clients: Record<string, string> = {};

  logger = new Logger('Online Serivce');

  public constructor(
		private readonly tokenService: TokenService,
		private readonly userService: UserService,
	) {}

  public async handleConnection(client: Socket): Promise<void> {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);

      const { sub: subject } = await this.tokenService.inspect(authorization);

      const newConnection = !Object.values(this.clients).includes(subject);

      client['subject'] = subject;
      this.clients[client.id] = subject;

      this.emitOnlineList();

      if (newConnection) this.logger.log(`Client connected: ${subject}`);
    } catch (error) {
      client.emit('online:error', 'You are not authenticated!');
      client.disconnect(true);
    }
  }

  public handleDisconnect(client: Socket): void {
    const subject = this.clients[client.id];

    delete this.clients[client.id];

    this.emitOnlineList();

    if (!Object.values(this.clients).includes(subject))
      this.logger.log(`Client disconnected:${subject}`);
  }

  @SubscribeMessage('online:list')
  public onlineList(@ConnectedSocket() client: Socket): void {
    this.emitOnlineList(client);
  }

  private emitOnlineList(to: Socket | Server = this.server): void {
		let onlineList = this.getUniqueUsers();
		for (const u of onlineList)
			this.userService.presence(u);
    to.emit('online:list', onlineList);
  }

  private getUniqueUsers(): string[] {
    return [...new Set(Object.values(this.clients)).values()];
  }
}
