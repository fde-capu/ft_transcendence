import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoomDTO } from './chat-room';

@Injectable()
export class ChatService {

	static allRooms: ChatRoomDTO[] = [];

  constructor(
  ) {
		this.mockRooms(); // TODO remove XXX
	}

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
		for (const i in ChatService.allRooms)
			if (ChatService.allRooms[i].id == u_room.id)
				ChatService.allRooms[i] = u_room;
	}

	mockRooms() {
		ChatService.allRooms.push({
					id: "chatRoomId_0",
					name: "fde-capu is user",
					user: ['fde-capu'],
					admin: [],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: true 
		});
		ChatService.allRooms.push({
					id: "chatRoomId_1",
					name: "fde-capu user and admin",
					user: ['fde-capu'],
					admin: ['fde-capu'],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: true 
		});
		ChatService.allRooms.push({
					id: "chatRoomId_2",
					name: "fde-capu is user but is password protected",
					user: ['fde-capu'],
					admin: [],
					blocked: [],
					muted: [],
					password: "user42",
					isPrivate: true 
		});
		ChatService.allRooms.push({
					id: "chatRoomId_3",
					name: "no one is user nor admin",
					user: [],
					admin: [],
					blocked: [],
					muted: [],
					password: "user42",
					isPrivate: false 
		});
		ChatService.allRooms.push({
					id: "chatRoomId_4",
					name: "some people are there but not you, w/o password",
					user: ['tanana', 'findim'],
					admin: ['tanana'],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: false 
		});
		ChatService.allRooms.push({
					id: "chatRoomId_5",
					name: "fde-capu is blocked",
					user: [],
					admin: [],
					blocked: ['fde-capu'],
					muted: [],
					password: "",
					isPrivate: false 
		});
		ChatService.allRooms.push({
					id: "chatRoomId_6",
					name: "fde-capu is user but muted",
					user: ['fde-capu'],
					admin: [],
					blocked: [],
					muted: ['fde-capu'],
					password: "",
					isPrivate: false 
		});
	}
}
