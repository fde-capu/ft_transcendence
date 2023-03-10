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
	let data: any;
	data = payload;

	console.log("Chat data", data);
	if (data.room_changed)
	{
		console.log("-> room_changed");
		this.chatService.roomChanged(data.room_changed);
		this.server.emit('chat', {
			author: client['subject'],
			payload: {
				update_rooms: this.chatService.allRooms()
			}
		}
		);
		return ;
	}
	if (payload == "get_rooms")
	{
		console.log("-> allRooms");
		this.server.emit('chat', {
			author: client['subject'],
			payload: {
				update_rooms: this.chatService.allRooms()
			}
		}
		);
		return ;
	}
	console.log("-> copy of payload");
	this.server.emit('chat', {
		author: client['subject'],
		payload: payload,
	});
	return ;
  }
}
