import { ActivatedRoute, Router, ParamMap, RoutesRecognized } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatSocket } from './chat.socket';
import { Observable, of } from 'rxjs';
import { ChatMessage } from './chat-message';
import { UserService } from './user.service';
import { User } from './user';
import { ChatRoom } from './chat-room';
import { USERS, CHATS, CHAT_ROOM } from './mocks';
import { HelperFunctionsService } from './helper-functions.service';

// TODO: all is mocked. Unmock them!

@Injectable({
  providedIn: 'root'
})
export class ChatService {
	private roomsUrl = 'http://localhost:3000/chatrooms/';
	chatMessage: ChatMessage[] = [];
	static chatRooms: ChatRoom[] = [];

	constructor(
		private readonly socket: ChatSocket,
		public route: ActivatedRoute,
		private readonly router: Router,
		private fun: HelperFunctionsService,
		private userService: UserService,
		private http: HttpClient,
	) {
//		this.mockChat();
	}

	add(chatMessage: ChatMessage) {
		this.chatMessage.push(chatMessage);
	}

	clear() {
		this.chatMessage = [];
	}

	getChatRoom(roomId: string|null): Observable<ChatRoom> {
		console.log("A getChatRoom called", ChatService.chatRooms);
		if (!roomId)
		{
			// Create new chatRoom, UNMOCK TODO
			return of(CHAT_ROOM[0]);
		}
		console.log("B getChatRoom called", ChatService.chatRooms);
		for (const room in ChatService.chatRooms)
		{
			if (ChatService.chatRooms[room].id == roomId)
				return of(ChatService.chatRooms[room]);
		}
//		this.router.navigate(['/rooms']);
//		return of({} as ChatRoom);
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
		// else (there is an id) subscribe to the the Observable.
		const chatRoom = CHAT_ROOM[0];
		return of(chatRoom);
	}
	getVisibleChatRooms(intraId: string|undefined): Observable<ChatRoom[]> {
		let userIn: boolean = false;
		let isPrivate: boolean = false;
		return this.http.get<ChatRoom[]>(this.roomsUrl+intraId,{withCredentials:true})
			.pipe(
				catchError(this.handleError<ChatRoom[]>('getVisibleChatRooms'))
			);
	}
	getInChatUsers(): Observable<string[]> {
		// TODO: it facilitates (always?) for the loggedUser to be in first position,
		// then the administrators, then eveyone else.
		const inChat = CHAT_ROOM[1].user;
		return of(inChat);
	}
	getOutOfChatUsers(): Observable<string[]> {
		// TODO: Everyone from userService.getOnlineUsers() minus who is already in.
		const inChat = CHAT_ROOM[2].user;
		return of(inChat);
	}
	getChatText(): Observable<ChatMessage[]> {
		return of(this.chatMessage);
	}

	getMessages() {
		//console.log("Invite service getting from socket.");
		return this.socket.fromEvent<any>('chat');
	}

	mockChat(): void {
		const self = this;
		let n: ReturnType<typeof setTimeout>;
		n = setTimeout(function(){
			console.log("Chat emitting.");
			self.socket.emit('chat', CHATS[Math.floor(Math.random() * CHATS.length)]);
			self.mockChat();
		}, Math.random() * 10000 + 5000);
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error("handleError<T>:", error); // log to console instead

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
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
