import { Component } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-chat-room-list',
  templateUrl: './chat-room-list.component.html',
  styleUrls: ['./chat-room-list.component.css']
})
export class ChatRoomListComponent {
	user?: User;
	visibleRooms: ChatRoom[] = [];
	constructor(
		private chatService: ChatService,
		private userService: UserService,
		public fun: HelperFunctionsService
	) {};
	password = new Map<string, string>;
	ngOnInit(): void {
		this.getChatRooms();
		this.getCurrentUser();
	}
	getChatRooms(): void {
		this.chatService.getVisibleChatRooms()
			.subscribe(rooms => this.visibleRooms = rooms);
	}
	getCurrentUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => this.user = user);
	}
	loggedUserIsIn(room: ChatRoom): Boolean {
		for (const user of room.user)
			if (user == this.user)
				return true;
		return false;
	}
	loggedUserIsBlocked(room: ChatRoom): Boolean {
		for (const user of room.blocked)
			if (user == this.user)
				return true;
		return false;
	}
	submitEntrance(room: ChatRoom) {
		alert('Request entrance on ' + room.name + ' useing password ' + this.password.get(room.id));
	}
}

