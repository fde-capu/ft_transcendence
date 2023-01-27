import { Component } from '@angular/core';
import { ChatMessageService } from '../chat-message.service';

@Component({
  selector: 'app-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css']
})
export class ChatTextComponent {
	constructor(public chatMessageService: ChatMessageService) {}
}
