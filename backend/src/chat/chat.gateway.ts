import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
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
    @MessageBody() payload: any, // TODO create a interface for it
  ) {
    if (payload.room_gone) {
      console.log('-> room_gone;');
      this.chatService.roomGone(payload.room_gone);
      this.broadcastChatRooms(client);
      return;
    }
    if (payload.room_changed) {
      console.log('-> room_changed;');
      this.chatService.roomChanged(payload.room_changed);
      this.broadcastChatRooms(client);
      return;
    }
    if (payload == 'get_rooms') {
      this.sendChatRoomsToSingleClient(client);
      return;
    }
    console.log('-> copy of payload (individual messages);');
    this.server.emit('chat', {
      author: client['subject'],
      payload: payload,
    });
    return;
  }

  broadcastChatRooms(client: Socket) {
    console.log('-> allRooms broadcast;');
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
