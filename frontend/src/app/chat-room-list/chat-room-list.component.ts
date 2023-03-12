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
	password = new Map<string, string>;

	constructor(
		private chatService: ChatService,
		private userService: UserService,
		public fun: HelperFunctionsService,
		private router: Router,
	) {};

	ngOnInit(): void {
		this.getCurrentUser();
	}

	async getChatRooms() {
		this.visibleRooms = await this.chatService.getVisibleChatRooms(this.user?.intraId);
		for (const room of this.visibleRooms)
			if (this.chatService.isAdmin(room.id, this.user?.intraId) && room.password)
				this.password.set(room.id, room.password);
		await new Promise(resolve => setTimeout(resolve, 1241));
		await this.getChatRooms();
	}

	getCurrentUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => {
				this.user = user;
				this.getChatRooms();
			});
	}

	loggedUserIsBlocked(room: ChatRoom): Boolean {
		if (!room.blocked) return false;
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
			let block = this.chatService.currentUserIsBlocked(room.id)
			if (this.password.get(room.id) != room.password || block)
			{
				let message = block ? " [ !!! YOU ARE BLOCKED !!! ] " : " [ !!! WRONG !!! ]"
				this.password.set(room.id, message);
				this.fun.blink('pass' + room.id); this.fun.blink('btn' + room.id);
				await new Promise(resolve => setTimeout(resolve, 342));
				this.fun.blink('pass' + room.id); this.fun.blink('btn' + room.id);
				await new Promise(resolve => setTimeout(resolve, 342));
				this.fun.blink('pass' + room.id); this.fun.blink('btn' + room.id);
				await new Promise(resolve => setTimeout(resolve, 342));
				this.password.set(room.id, "");
				this.fun.focus('pass' + room.id);
				return ;
			}
			this.router.navigate(['/chat/' + room.id]);
		}
	}

	async submitEntranceByAnyPassword() {
		let privatePassword = this.password.get('private');
		if (!privatePassword)
			this.fun.focus('passprivate');
		else
		{
			let passwordLink: string|null = this.chatService.testPasswordLink(privatePassword);
			let block: boolean = false;
			if (passwordLink)
				block = !!this.chatService.currentUserIsBlocked(passwordLink);
			if (!passwordLink || block)
			{
				let message = block ? " [ !!! YOU ARE BLOCKED !!! ] " : " [ !!! WRONG !!! ]"
				this.password.set('private', message);
				this.fun.blink('passprivate'); this.fun.blink('btnprivate');
				await new Promise(resolve => setTimeout(resolve, 342));
				this.fun.blink('passprivate'); this.fun.blink('btnprivate');
				await new Promise(resolve => setTimeout(resolve, 342));
				this.fun.blink('passprivate'); this.fun.blink('btnprivate');
				await new Promise(resolve => setTimeout(resolve, 342));
				this.password.set('private', "");
				this.fun.focus('passprivate');
				return ;
			}
			this.router.navigate(['/chat/' + passwordLink]);
		}
	}

}
