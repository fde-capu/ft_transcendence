import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoomDTO } from './chat-room';

@Injectable()
export class ChatService {

static allRooms: ChatRoomDTO[] = [];

  constructor(
  ) {}

	async getAllRooms(intraId?:string):Promise<ChatRoomDTO[]>
	{
		return ChatService.allRooms;
	}

	allRooms(): ChatRoomDTO[]
	{
		return ChatService.allRooms;
	}

	roomChanged(u_room: ChatRoomDTO)
	{
		// \/ Index reference is optimal for the case.
		for (const i in ChatService.allRooms)
			if (ChatService.allRooms[i].id == u_room.id) {
				ChatService.allRooms[i] = u_room;
				return ;
			}
		ChatService.allRooms.push(u_room);
	}

	roomGone(roomId: string)
	{
		let newRooms: ChatRoomDTO[] = [];
		for (const room of ChatService.allRooms)
			if (room.id != roomId)
				newRooms.push(room);
		ChatService.allRooms = newRooms;
	}
}
