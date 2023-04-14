import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat.service';
import { environment } from 'src/environment';

@WebSocketGateway({
  cors: { origin: environment.FRONTEND_ORIGIN, credentials: true },
  cookie: true,
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('chat')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any, // Maleable json objects
    // are bein used for different
    // responses. No fixed interface.
  ) {
    if (payload.room_gone) {
      this.chatService.roomGone(payload.room_gone);
      this.broadcastChatRooms(client);
      return;
    }
    if (payload.room_changed) {
      this.chatService.roomChanged(payload.room_changed);
      this.broadcastChatRooms(client);
      return;
    }
    if (payload == 'get_rooms') {
      this.sendChatRoomsToSingleClient(client);
      return;
    }
    this.server.emit('chat', {
      author: client['subject'],
      payload: payload,
    });
    return;
  }

  broadcastChatRooms(client: Socket) {
    this.server.emit('chat', {
      author: client['subject'],
      payload: {
        update_rooms: this.chatService.allRooms(),
      },
    });
  }

  sendChatRoomsToSingleClient(client: Socket) {
    client.emit('chat', {
      author: client['subject'],
      payload: {
        update_rooms: this.chatService.allRooms(),
      },
    });
  }
}
