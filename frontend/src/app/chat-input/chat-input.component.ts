import { Component } from '@angular/core';
import { ChatMessageService } from '../chat-message.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
	constructor(public chatMessageService: ChatMessageService) {}
}
