import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export interface Invitation {
  from: string;
  to: string;
  type: string;
  route: string;
  answer?: boolean;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'invite',
})
export class InvitationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('invitation')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
    this.server.emit('invitation', {
      author: client['subject'],
      payload: payload,
    });
  }
}
