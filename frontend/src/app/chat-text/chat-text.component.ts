import { Component, Input, ViewChild } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ChatMessageService } from '../chat.service';

@Component({
  selector: 'app-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css']
})
export class ChatTextComponent {
	chatMessage: ChatMessage[] = [];
	constructor (
		public chatMessageService: ChatMessageService
	) {}
	ngOnInit() {
		this.chatMessageService.getChatText().subscribe(
			chatMessage => {
				// TODO: Show only last N messages? (Avoid long scrolls?)
				this.chatMessage = chatMessage;
			}
		);
	}
}
