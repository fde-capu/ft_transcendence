import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css'],
})
export class ChatTextComponent implements OnInit {
  chatMessage: ChatMessage[] = [];
  constructor(public chatService: ChatService) {}
  ngOnInit() {
    this.chatService.getChatText().subscribe(chatMessage => {
      // TODO: Show only last N messages? (Avoid long scrolls?)
      this.chatMessage = chatMessage;
    });
  }
}
