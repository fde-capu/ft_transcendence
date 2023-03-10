import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoomDTO } from './chat-room';

@Injectable()
export class ChatService {

	static allRooms: ChatRoomDTO[] = [];

  constructor(
  ) {
		this.mockRooms(); // TODO remove XXX
	}

	async getAllRooms():Promise<ChatRoomDTO[]>
	{
		return ChatService.allRooms;
	}

	async getVisibleRooms(intraId: string):Promise<ChatRoomDTO[]>
	{
		// TODO: Visible Chat Rooms must be of one of the conditions:
		// Is visible if the loggedUser is in the room.
		// Is visible if the room is public.
		let out: ChatRoomDTO[] = [];
		let put: boolean = false;
		console.log("getVisibleRooms for ", intraId);
		for (const room of ChatService.allRooms)
		{
			put = false;
			if (!room.isPrivate)
				put = true;
			for (const u of room.user)
			{
				console.log("getVisibleRooms user for", u);
				if (u == intraId)
					put = true;
			}
			for (const u in room.admin)
				if (room.admin[u] == intraId)
					put = true;
			if (put)
				out.push(room);
		}
		return out;
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
					name: "fde-capu is only admin not user",
					user: [],
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
					name: "no one is user nor admin, w/o password",
					user: [],
					admin: [],
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
					user: [],
					admin: [],
					blocked: [],
					muted: ['fde-capu'],
					password: "",
					isPrivate: false 
		});
	}
}
