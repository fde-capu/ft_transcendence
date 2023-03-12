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
	//console.log("Chat got", payload);
	let data: any;
	data = payload; // Magicaly converts unreadable JSON data into readable. (Payload is kindda string|Object, JSON.parse fails (!) and this works (!).)
	//console.log("Chat data", data);

	if (data.room_gone)
	{
		console.log("-> room_gone;", data.room_gone);
		this.chatService.roomGone(data.room_gone);
		this.broadcastChatRooms(client);
		return ;
	}
	if (data.room_changed)
	{
		console.log("-> room_changed;");
		this.chatService.roomChanged(data.room_changed);
		this.broadcastChatRooms(client);
		return ;
	}
	if (payload == "get_rooms")
	{
		this.broadcastChatRooms(client);
		return ;
	}
	// (else) // Watta terrible switch case!
	console.log("-> copy of payload (individual messages);");
	this.server.emit('chat', {
		author: client['subject'],
		payload: payload,
	});
	return ;
  }

  broadcastChatRooms(client: Socket)
  {
	console.log("-> allRooms broadcast;");
	this.server.emit('chat', {
		author: client['subject'],
		payload: {
			update_rooms: this.chatService.allRooms()
		}
	});
  }
}
