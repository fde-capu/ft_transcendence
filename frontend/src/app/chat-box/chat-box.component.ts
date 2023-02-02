import { Component } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatMessageService } from '../chat-message.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
	constructor (private chatMessageService: ChatMessageService) {}
	chatRoomOn: Boolean = true;
	chatRoom: ChatRoom = {} as ChatRoom;
	windowName: string = "CHAT";
	windowExtras: string = "";
	optionsOn: Boolean = true;
	titleHeight: Number = 32;

	ngOnInit() {
		this.chatMessageService.getChatRoom().subscribe(
			chatRoom => this.chatRoom = chatRoom
		);
		this.windowName = this.windowName + ": " + this.chatRoom.name;
		this.windowExtras = ""
		+ (this.chatRoom.isPrivate ? "PRIVATE" : "")
		+ (this.chatRoom.isPrivate && this.chatRoom.password ? " | " : "")
		+ (this.chatRoom.password ? "PASSWORD: " + this.chatRoom.password : "")
		this.titleHeight = 4 +
		(this.chatRoom.isPrivate || this.chatRoom.password ? 32 : 16)
	}

	onClose() {
		alert (`
			// TODO: User exits Chat Room.
			// If they are the only admin, who takes administration?
		`);
	}

	onMenu() {
		this.optionsOn = this.optionsOn ? false : true;
	}

}
