import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';
import { RoomService } from './room.service';
import { User } from '../entity/room.entity';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: /\/room\/.+/,
})
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly tokenService: TokenService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const { authorization } = parse(client.handshake.headers.cookie);
      const { sub: subject } = await this.tokenService.inspect(authorization);
      client['subject'] = subject;
      console.log(client.nsp.name);
      client['roomId'] = client.nsp.name.match(
        /room\/(?<roomId>.+)\/?$/,
      ).groups['roomId'];
      const user = new User(subject, subject); // TODO: get name from user service
      const room = this.roomService.join(user, client['roomId']);
      client.emit('game:room:info', room);
    } catch (error) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const user = new User(client['subject'], client['subject']);
    this.roomService.leave(user, client['roomId']);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    client.nsp.emit('message', {
      room: client.nsp.name,
      author: client['subject'],
      payload: payload,
    });
  }
}
