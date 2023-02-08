import { Component, Input } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatMessageService } from '../chat-message.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { User } from '../user';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
	constructor (
		public chatMessageService: ChatMessageService,
		public fun: HelperFunctionsService
	) {}
	chatRoomOn = true;
	chatRoom: ChatRoom = {} as ChatRoom;
	windowTitle = "CHAT";
	windowName = "";
	windowExtras = "";
	optionsOn = false;
	usersOn: User[] = [];
	@Input() user?: User;

	ngOnInit() {
		this.chatMessageService.getChatRoom().subscribe(
			chatRoom => this.chatRoom = chatRoom
		);
		this.chatMessageService.getInChatUsers().subscribe(
			inChat => this.usersOn = inChat
		);
		this.imprintInfo();
	}

	imprintInfo() {
		this.windowName = this.windowTitle + ": " + this.chatRoom.name;
		this.windowExtras = ""
		+ (this.chatRoom.isPrivate ? "PRIVATE" : "PUBLIC")
		+ " "
		+ (this.chatRoom.password ? "PROTECTED" : "")
	}

	onClose() {
		if (this.optionsOn)
		{
			return this.onMenu();

		}
		alert (`
			// TODO: User exits Chat Room, the window closes.
			// If they are the only admin, who takes administration?
		`);
	}

	menuFor(user: User)
	{
		alert(user.name);
	}

	onMenu() {
		this.optionsOn = this.optionsOn ? false : true;
	}

	switchPrivacy() {
		this.chatRoom.isPrivate = !this.chatRoom.isPrivate;
		this.imprintInfo();
	}

	cleanPassword() {
		this.chatRoom.password = "";
		this.imprintInfo();
	}

	isAdmin(user: User): boolean {
		for (const admin of this.chatRoom.admin)
			if (admin == user)
				return true;
		return false;
	}

	isMe(user: User): boolean {
		return user === this.user;
	}
}
