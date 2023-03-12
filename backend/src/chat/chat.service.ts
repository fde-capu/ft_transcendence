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

	mockRooms() {
		ChatService.allRooms.push({
					id: "gfertfgger",
					name: "Some user in public",
					user: ['some-user'],
					admin: ['some-user'],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: false 
		});
		// ^ Rooms with only one user should always make them admin.
		ChatService.allRooms.push({
					id: "egregrt5egr5",
					name: "fde-capu is admin (public)",
					user: [],
					admin: ['fde-capu'],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: false 
		});
		// ^ Even if user left the room and is the admin, room is listed.
		ChatService.allRooms.push({
					id: "gwe4rtfwsedf",
					name: "fde-capu is admin (private)",
					user: [],
					admin: ['fde-capu'],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: true 
		});
		// ^ If the room is private, still listed but only to the admin.
		ChatService.allRooms.push({
					id: "er5ety5re5yg",
					name: "auto generated name for one-on-one conversations",
					user: ['someone-one-on-one', 'the-other-person'],
					admin: ['someone-one-on-one', 'the-other-person'],
					blocked: [],
					muted: [],
					password: "",
					isPrivate: true 
		});
		// ^ This was, for example, initializated by sending a private
		// message. So both users are admin.
		ChatService.allRooms.push({
					id: "chatRoomId_4",
					name: "password protected",
					user: ['tanana', 'findim'],
					admin: ['tanana'],
					blocked: [],
					muted: [],
					password: "user421",
					isPrivate: false 
		});
		// ^ By logic, a password protected room is only usefull when
		// its public. (Privates are only listed to admins.)
		ChatService.allRooms.push({
					id: "chatRoomId_5",
					name: "private room with password",
					user: [],
					admin: ['someone'],
					blocked: [],
					muted: [],
					password: "user420",
					isPrivate: true 
		});
		// ^ However, a protected private room can be accessed
		// knowing the password. Because its not listed, there's
		// a special field of submission.
		ChatService.allRooms.push({
					id: "fwefewe4fw",
					name: "fde-capu is muted",
					user: [],
					admin: ['someone-away'],
					blocked: [],
					muted: ['fde-capu'],
					password: "",
					isPrivate: false 
		});
		ChatService.allRooms.push({
					id: "fqw3e4rfw",
					name: "fde-capu is blocked",
					user: [],
					admin: ['someone-away', 'tanana'],
					blocked: ['fde-capu'],
					muted: [],
					password: "",
					isPrivate: false 
		});
	}
}
