import { Component, Input } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ChatMessageService } from '../chat-message.service';

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
			chatMessage => this.chatMessage = chatMessage
		);
//		this.imprintInfo();
	}
}
