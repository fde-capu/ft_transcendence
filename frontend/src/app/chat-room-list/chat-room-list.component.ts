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
		this.getCurrentUser();
	}
	async getChatRooms() {
		this.visibleRooms = await this.chatService.getVisibleChatRooms(this.user?.intraId);
		await new Promise(resolve => setTimeout(resolve, 1000));
		await this.getChatRooms();
	}
	getCurrentUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => {
				this.user = user;
				this.getChatRooms();
			}
			);
	}
	loggedUserIsIn(room: ChatRoom): Boolean {
		for (const user of room.user)
			if (user == this.user?.intraId)
				return true;
		for (const user of room.admin)
			if (user == this.user?.intraId)
				return true;
		return false;
	}
	loggedUserIsBlocked(room: ChatRoom): Boolean {
		for (const user of room.blocked)
			if (user == this.user?.intraId)
				return true;
		return false;
	}
	submitEntrance(room: ChatRoom) {
		if (!this.password.get(room.id))
			this.fun.focus('pass'+room.id);
		else
			alert('Request entrance on ' + room.name + ' useing password ' + this.password.get(room.id));
	}
}
