import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../chat-message';
import { ChatService } from '../chat.service';
import { ChatRoom } from '../chat-room';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css'],
})
export class ChatTextComponent implements OnInit {
  chatMessage: ChatMessage[] = [];

  @Input() room: ChatRoom = {} as ChatRoom;

  constructor(
		public chatService: ChatService,
		public userService: UserService,
		public router: Router,
	) {}

  ngOnInit() {
    this.chatService.messageList.subscribe(msg => {
      if (msg && msg.roomId == this.room.id) {
        this.chatMessage.push(msg);
      }
    });
  }

	isFriend(u: User) {
    return this.userService.isFriend(u);
	}

	isBlock(u: User) {
    return this.userService.isBlock(u);
	}

	amIBlocked(u: User) {
    return this.userService.amIBlocked(u);
	}

	goToProfile(u: string) {
		this.router.navigate(['/profile/' + u]);
	}
}
