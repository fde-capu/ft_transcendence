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

export interface Chatter {
	from: string;
	to: string;
	type: string;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(private readonly tokenService: TokenService) {}

  async handleConnection(client: Socket, ...args: any[]) {}

  @SubscribeMessage('chat')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
	console.log("Chat got", payload);
    this.server.emit('chat', {
      author: client['subject'],
      payload: payload,
    });
  }
}
