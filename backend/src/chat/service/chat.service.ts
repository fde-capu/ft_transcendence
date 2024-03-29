import { Injectable } from '@nestjs/common';
import { ChatRoomDTO } from '../interface/chat-room.dto';

@Injectable()
export class ChatService {
  static allRooms: ChatRoomDTO[] = [];

  async getAllRooms(): Promise<ChatRoomDTO[]> {
    return ChatService.allRooms;
  }

  allRooms(): ChatRoomDTO[] {
    return ChatService.allRooms;
  }

  validStringLength(str: string, min: number, max: number): boolean {
    return str && str.length >= min && str.length <= max;
  }

  roomChanged(u_room: ChatRoomDTO) {
    for (const i in ChatService.allRooms)
      if (ChatService.allRooms[i].id == u_room.id) {
        if (!this.validStringLength(u_room.name, 4, 42))
          u_room.name = ChatService.allRooms[i].name;
        if (
          u_room.password &&
          u_room.password.length &&
          !this.validStringLength(u_room.password, 4, 42)
        )
          u_room.password = ChatService.allRooms[i].password;
        ChatService.allRooms[i] = u_room;
        return;
      }
    ChatService.allRooms.push(u_room);
  }

  roomGone(roomId: string) {
    const newRooms: ChatRoomDTO[] = [];
    for (const room of ChatService.allRooms)
      if (room.id != roomId) newRooms.push(room);
    ChatService.allRooms = newRooms;
  }
}
