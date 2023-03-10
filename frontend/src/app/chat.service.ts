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
	user: User | undefined = undefined;
	static connected: boolean = false;

	constructor(
		private readonly socket: ChatSocket,
		public route: ActivatedRoute,
		private readonly router: Router,
		private fun: HelperFunctionsService,
		private http: HttpClient,
		public userService: UserService,
	) {
//		this.mockChat(); // Mock MUST be on backend
		this.userService.getLoggedUser().subscribe(_=>{
			this.user = _;
		});
		this.subscribeSocketIfNotYet();
	}

	think(roomId: string, msg: string)
	{
		console.log("Thinking about: ", msg);
		// Maybe add() to some history,
		// maybe create new chat room
		// maybe change users status
	}

	subscribeSocketIfNotYet() {
		if (ChatService.connected) return;
		this.socketSubscription();
	}

	socketSubscription() {
		console.log("ChatService subscribing to socket.");
		this.getMessages().subscribe(
			_ => {
				console.log("Chat subscription got", _.payload);
				for (const room of ChatService.chatRooms)
					this.think(room.id, _.payload);
			},
		);
		ChatService.connected = true;
	}

	sendMessage(chatMessage: ChatMessage) {
		console.log("Chat emitting.");
		this.socket.emit('chat', chatMessage);
	}

	add(chatMessage: ChatMessage) {
		this.chatMessage.push(chatMessage);
	}

	clear() {
		this.chatMessage = [];
	}

	roomById(roomId?: string): ChatRoom {
		if (!roomId) return {} as ChatRoom;
		for (const room of ChatService.chatRooms)
			if (room.id == roomId)
				return room;
		return {} as ChatRoom;
	}

	getOrInitChatRoom(roomId: string|null): ChatRoom {
		console.log("getOrInitChatRoom called", ChatService.chatRooms);
		if (!roomId)
		{
			// Create new chatRoom, UNMOCK TODO
			return CHAT_ROOM[0];
		}
		return this.roomById(roomId);
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

	loggedUserIsMuted(roomId?: string): boolean {
		if (!this.user) return false;
		const room = this.roomById(roomId);
		if (!room || !room.muted || !room.muted.length) return false;
		for (const intraId of room.muted)
			if (intraId == this.user.intraId)
				return true;
		return false;
	}

	getChatHistory(roomId?: string): ChatMessage[] {
		return this.roomById(roomId).history;
	}

	clearHistory(roomId?: string) {
		this.roomById(roomId).history = [];
	}

	getMessages() {
		//console.log("Chat service getting from socket.");
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
