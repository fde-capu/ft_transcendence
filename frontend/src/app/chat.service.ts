// This could be better called simple ChatService.
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatMessage } from './chat-message';
import { ChatRoom } from './chat-room';
import { CHATS, CHAT_ROOM } from './mocks';
import { User } from './user';
import { USERS } from './mocks';

// TODO: all is mocked. Unmock them!

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
	chatMessage: ChatMessage[] = [];

	constructor() {
		this.mockChat();
	}

	add(chatMessage: ChatMessage) {
		this.chatMessage.push(chatMessage);
	}

	clear() {
		this.chatMessage = [];
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
	getInChatUsers(): Observable<User[]> {
		// TODO: it facilitates (always?) for the loggedUser to be in first position,
		// then the administrators, then eveyone else.
		const inChat = CHAT_ROOM[0].user;
		return of(inChat);
	}
	getChatText(): Observable<ChatMessage[]> {
		return of(this.chatMessage);
	}
}

// TODO:
// - Implement direct-messaging.
// - Chat creationg screen.
// - "Block user" routine.

// - The user should be able to invite other users to 
//   play a Pong game through the chat interface.
// - Should also be able to access user profiles.
//  :: These two things will be done by the avatar element, however.

// Matchmaking screen.
