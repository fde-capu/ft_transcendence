import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ChatMessage } from './chat-message';
import { User } from './user';
import { ChatRoom } from './chat-room';
import { USERS, CHATS, CHAT_ROOM } from './mocks';

// TODO: all is mocked. Unmock them!

@Injectable({
  providedIn: 'root'
})
export class ChatService {
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

	mockChat(): void {
		const self = this;
		let n: ReturnType<typeof setTimeout>;
		n = setTimeout(function(){
			self.add(CHATS[Math.floor(Math.random() * CHATS.length)]);
			self.mockChat();
		}, Math.random() * 10000 + 5000);
	}

	getChatRoom(): Observable<ChatRoom> {
		// TODO: Get ID from query/cookie.
		// if (id is empty) return a NEW chat Room, with:
		//		ChatRoom
		// 		{
		// 		 	id: string, // New unique-id.
		// 		 	name: string, // Some random name like "User's Room".
		// 		 	user: User[], // Array with current user on.
		// 		 	admin: User[], // Array with current user on.
		// 		 	history: ChatMessage[], // Empty.
		// 		 	password: string, // Empty.
		// 		 	isPrivate: boolean // True.
		// 		}
		// else (there is and id) subscribe to the the Observable.
		const chatRoom = CHAT_ROOM[0];
		return of(chatRoom);
	}
	getVisibleChatRooms(): Observable<ChatRoom[]> {
		// TODO: Visible Chat Rooms must be of one of the conditions:
		// Is visible if the loggedUser is in the room.
		// Is visible if the room is public.
		// Should deliver this already filtered (prefered),
		// or is it filtered here?
		const rooms = CHAT_ROOM;
		return of(rooms);
	}
	getInChatUsers(): Observable<User[]> {
		// TODO: it facilitates (always?) for the loggedUser to be in first position,
		// then the administrators, then eveyone else.
		const inChat = CHAT_ROOM[1].user;
		return of(inChat);
	}
	getOutOfChatUsers(): Observable<User[]> {
		// TODO: Everyone from userService.getOnlineUsers() minus who is already in.
		const inChat = CHAT_ROOM[2].user;
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
