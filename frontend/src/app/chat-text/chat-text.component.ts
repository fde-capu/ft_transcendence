import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ChatService } from '../chat.service';
import { ChatRoom } from '../chat-room';

@Component({
  selector: 'app-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css'],
})
export class ChatTextComponent implements OnInit {
  chatMessage: ChatMessage[] = [];

  @Input() room: ChatRoom = {} as ChatRoom;

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.chatService.messageList.subscribe(msg => {
      if (msg && msg.roomId == this.room.id) {
        this.chatMessage.push(msg);
      }
    });
  }
}
