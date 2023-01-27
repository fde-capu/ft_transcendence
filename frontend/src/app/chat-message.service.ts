import { Injectable } from '@angular/core';
import { ChatMessage } from './chat-message-interface';
import { User } from './user-interface';
import { CHATS } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
	chat: ChatMessage[] = [];

	constructor() {
		// TODO remove these lines, do it properly.
		this.add(CHATS[0]);
		this.add(CHATS[1]);
		this.add(CHATS[2]);
	}

	add(chatMessage: ChatMessage) {
		this.chat.push(chatMessage);
	}

	clear() {
		this.chat = [];
	}

	ngOnInit(): void {

	}
}
