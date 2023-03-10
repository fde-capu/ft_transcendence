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
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(
	private readonly tokenService: TokenService,
	private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {}

  @SubscribeMessage('chat')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
	console.log("Chat got", payload);
	if (payload == 'update')
	{
		this.server.emit('chat', {update_rooms: this.chatService.allRooms() });
	}
	else
	{
		this.server.emit('chat', {
			author: client['subject'],
			payload: payload,
		});
	}
  }
}
