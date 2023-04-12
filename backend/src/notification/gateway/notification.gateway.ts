import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { environment } from 'src/environment';
import { NotificationService } from '../service/notification.service';
import { Notification } from '../entity/notification.entity';

@WebSocketGateway({
  cors: { origin: environment.FRONTEND_ORIGIN, credentials: true },
  cookie: true,
  namespace: 'notification',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  public constructor(
    private readonly tokenService: TokenService,
    private readonly notificationService: NotificationService,
  ) {}

  public async handleConnection(client: Socket): Promise<void> {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);

      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;

      this.notificationService.addSocket(client);
    } catch (error) {
      client.emit('notification:error', 'You are not authenticated!');
      client.disconnect(true);
    }
  }

  public handleDisconnect(client: Socket): void {
    this.notificationService.removeSocket(client);
  }

  @SubscribeMessage('notification:create')
  public notificationCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() request: Omit<Notification, 'id' | 'answerable' | 'answer'>,
  ): void {
    try {
      this.notificationService.createNotification({
        ...request,
        from: { intraId: client['subject'] },
      });
    } catch (error) {
      client.emit('notification:error', error.message);
    }
  }

  @SubscribeMessage('notification:answer')
  public notificationAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() request: Pick<Notification, 'id' | 'answer'>,
  ): void {
    try {
      this.notificationService.answerNotification(request);
    } catch (error) {
      client.emit('notification:error', error.message);
    }
  }
}
