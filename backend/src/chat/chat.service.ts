import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoomDTO } from './chat-room';

@Injectable()
export class ChatService {
  constructor(
  ) {
		this.mockRooms(); // TODO remove XXX
	}

	static allRooms: ChatRoomDTO[] = [];

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
		for (const i in ChatService.allRooms)
		{
			put = false;
			if (!ChatService.allRooms[i].isPrivate)
				put = true;
			for (const u in ChatService.allRooms[i].user)
			{
				console.log("getVisibleRooms user on", ChatService.allRooms[i].user[u]);
				if (ChatService.allRooms[i].user[u] == intraId)
					put = true;
			}
			for (const u in ChatService.allRooms[i].admin)
				if (ChatService.allRooms[i].admin[u] == intraId)
					put = true;
			if (put)
				out.push(ChatService.allRooms[i]);
		}
		return out;

	}

	mockRooms() {
		ChatService.allRooms.push({
					id: "FOO-1-id",
					name: "1 Mock's Chat",
					user: ['fde-capu'],
					admin: [],
					blocked: [],
					password: "",
					isPrivate: true 
		});
		ChatService.allRooms.push({
					id: "FOO2-id",
					name: "2 Mock's Chat",
					user: [],
					admin: ['fde-capu'],
					blocked: [],
					password: "",
					isPrivate: true 
		});
		ChatService.allRooms.push({
					id: "FOO-3-id",
					name: "3 Mock's Chat",
					user: [],
					admin: [],
					blocked: [],
					password: "user42",
					isPrivate: true 
		});
		ChatService.allRooms.push({
					id: "FOO-4-id",
					name: "4 Mock's Chat",
					user: [],
					admin: [],
					blocked: [],
					password: "user42",
					isPrivate: false 
		});
	}
}
