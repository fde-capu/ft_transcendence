import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { parse } from 'cookie';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
})
export class GameGateway implements OnGatewayConnection {
  handleConnection(client: Socket, ...args: any[]) {
    console.log(parse(client.handshake.headers.cookie)); // TODO use auth here
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    client.emit('message', 'ta ai?');
    console.log(payload);
  }
}
