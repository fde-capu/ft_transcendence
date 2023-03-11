import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
		public fun: HelperFunctionsService,
		private router: Router,
	) {};
	password = new Map<string, string>;
	ngOnInit(): void {
		this.getCurrentUser();
	}
	async getChatRooms() {
		this.visibleRooms = await this.chatService.getVisibleChatRooms(this.user?.intraId);
		await new Promise(resolve => setTimeout(resolve, 3000)); // Is 3 seconds too lazy?
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
	loggedUserIsBlocked(room: ChatRoom): Boolean {
		for (const user of room.blocked)
			if (user == this.user?.intraId)
				return true;
		return false;
	}
	async submitEntrance(room: ChatRoom) {
		if (!this.password.get(room.id))
			this.fun.focus('pass'+room.id);
		else
		{
			if (this.password.get(room.id) != room.password)
			{
				this.password.set(room.id, "  [ !!! WRONG !!! ]");
				this.fun.blink('pass' + room.id); this.fun.blink('btn' + room.id);
				await new Promise(resolve => setTimeout(resolve, 342));
				this.fun.blink('pass' + room.id); this.fun.blink('btn' + room.id);
				await new Promise(resolve => setTimeout(resolve, 342));
				this.fun.blink('pass' + room.id); this.fun.blink('btn' + room.id);
				await new Promise(resolve => setTimeout(resolve, 342));
				this.password.set(room.id, "");
				return ;
			}
			this.router.navigate(['/chat/' + room.id]);
		}
	}
}
