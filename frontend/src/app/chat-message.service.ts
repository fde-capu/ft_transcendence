// This could be better called simple ChatService.
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatMessage } from './chat-message';
import { ChatRoom } from './chat-room';
import { CHATS, CHAT_ROOM } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
	chat: ChatMessage[] = [];

	constructor() {
		// TODO remove these lines, do it properly.
		this.mockChat();
	}

	add(chatMessage: ChatMessage) {
		console.log(chatMessage.message);
		this.chat.push(chatMessage);
	}

	clear() {
		this.chat = [];
	}

	ngOnInit(): void {

	}

	mockChat(): void {
		const self = this;
		let n: ReturnType<typeof setTimeout>;
		n = setTimeout(function(){
			self.add(CHATS[Math.floor(Math.random() * CHATS.length)]);
			self.mockChat();
		}, Math.random() * 10000 + 5000);
	}

	getChatRoom(): Observable<ChatRoom> {
		const chatRoom = CHAT_ROOM[0];
		return of(chatRoom);
	}
}
