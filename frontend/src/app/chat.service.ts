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
	static doneOnce: boolean = false;
	static firstUpdate: boolean = false;

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
		this.subscribeOnce();
	}

	think(msg: any)
	{
		console.log("Thinking about: ", msg);
		if (msg.payload) // Check room, and if user can receive first, then
			this.add(msg.payload);
		if (msg.update_rooms)
		{
			console.log("think setting rooms", msg.update_rooms);
			ChatService.chatRooms = msg.update_rooms;
			ChatService.firstUpdate = true;
		}
		// Maybe add() to some history,
		// maybe create new chat room
		// maybe change users status
		// basically all chatRooms updates
		// and messages.
				// for (const room of ChatService.chatRooms)
	}

	async subscribeOnce(): Promise<void> {
		if (!ChatService.doneOnce)
			this.socketSubscription();
		if (ChatService.firstUpdate) return;
		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log("timeout");
		if (!ChatService.firstUpdate) return await this.subscribeOnce();
	}

//	mockChat(): void {
//		const self = this;
//		let n: ReturnType<typeof setTimeout>;
//		n = setTimeout(function(){
//			console.log("Chat emitting.");
//			self.socket.emit('chat', CHATS[Math.floor(Math.random() * CHATS.length)]);
//			self.mockChat();
//		}, Math.random() * 10000 + 5000);
//	}

	socketSubscription() {
		console.log("ChatService subscribing to socket.");
		this.getMessages().subscribe(
			_ => {
				console.log("Chat subscription got", _);
					this.think(_);
			},
		);
		ChatService.doneOnce = true;
		this.requestUpdate();
	}

	requestUpdate() {
		console.log("Requesting update");
		this.socket.emit('chat', 'update');
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
		console.log("CS roomById", roomId);
		if (!roomId) return {} as ChatRoom;
		for (const room of ChatService.chatRooms)
		{
			if (room.id == roomId)
			{
				console.log("CS returning", room);
				return room;
			}
		}
		console.log("CS returning empty");
		return {} as ChatRoom;
	}

	getOrInitChatRoom(roomId: string|null): ChatRoom {
		console.log("getOrInitChatRoom called for", roomId);
		if (!roomId)
		{
			// Create new chatRoom, UNMOCK TODO
			return CHAT_ROOM[0];
		}
		console.log("getOrInitChatRoom calls roomById", roomId);
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

	getInChatUsers(roomId?: string): string[] {
		if (!roomId) return [];
		console.log("gICU calls roomById", roomId);
		return this.roomById(roomId).user;
	}

	userIsInChat(roomId?: string, intraId?: string): boolean
	{
		if (!roomId || !intraId) return false;
		console.log("uIIC calls roomById", roomId);
		const room = this.roomById(roomId);
		for (const roomIntraId of room.user)
			if (intraId == roomIntraId)
				return true;
		return false;
	}

	isAdmin(roomId?: string|null, intraId?: string): boolean
	{
		if (!roomId || !intraId) return false;
		console.log("iA calls roomById", roomId);
		const room = this.roomById(roomId);
		for (const roomIntraId of room.admin)
			if (intraId == roomIntraId)
				return true;
		return false;
	}

	getOutOfChatUsers(roomId?: string): Observable<User[]> {
		if (!roomId) return of([]);
		let out: User[] = [];
		this.userService.getOnlineUsers().subscribe(_=>{
			for (const user of _)
				if (!this.userIsInChat(roomId, user.intraId))
					out.push(user);
		});
		return of(out);
	}

	loggedUserIsMuted(roomId?: string): boolean {
		if (!this.user || !roomId) return false;
		console.log("lUIM calls roomById", roomId);
		const room = this.roomById(roomId);
		if (!room || !room.muted || !room.muted.length) return false;
		for (const intraId of room.muted)
			if (intraId == this.user.intraId)
				return true;
		return false;
	}

	getChatHistory(roomId?: string): ChatMessage[] {
		console.log("gCH calls roomById", roomId);
		return this.roomById(roomId).history;
	}

	clearHistory(roomId?: string) {
		console.log("cH calls roomById", roomId);
		this.roomById(roomId).history = [];
	}

	getMessages() {
		console.log("Chat service getting from socket.");
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

