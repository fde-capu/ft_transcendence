import { Component, Input, ViewChild } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ChatService } from '../chat.service';
import { ChatRoom } from '../chat-room';

@Component({
  selector: 'app-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css']
})
export class ChatTextComponent {
	chatMessage: ChatMessage[] = [];
	@Input() room: ChatRoom = {} as ChatRoom;
	constructor (
		public chatService: ChatService
	) {}
	ngOnChanges() {
		this.chatMessage = this.room?.history;
	}
}
