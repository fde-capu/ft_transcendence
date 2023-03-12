import { ActivatedRoute, Router, ParamMap, RoutesRecognized } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatSocket } from './chat.socket';
import { Observable, of, BehaviorSubject } from 'rxjs';
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
	user: User | undefined = undefined;
	static doneOnce: boolean = false;
	static firstUpdate: boolean = false;

	static allRooms: ChatRoom[] = [];
	public readonly messageList = new BehaviorSubject<ChatMessage>({} as ChatMessage);

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
		if (msg.payload.roomId) // This checks if is a simple message.
		{
			for (const room of ChatService.allRooms)
				if (room.id == msg.payload.roomId)
				{
					// Now see if is not blocked etc TODO
					this.messageList.next(msg.payload);
				}
		}
		if (msg.payload.update_rooms)
		{
			ChatService.allRooms = msg.payload.update_rooms;
			ChatService.firstUpdate = true;
		}
		// Maybe add() to some history,
		// maybe create new chat room
		// maybe change users status
		// basically all allRooms updates
		// and messages.
				// for (const room of ChatService.allRooms)
	}

	// Promise<void> is needed \/
	async subscribeOnce(): Promise<void> {
		if (!ChatService.doneOnce)
			this.socketSubscription();
		if (ChatService.firstUpdate) return;
		await new Promise(resolve => setTimeout(resolve, 1000));
		if (!ChatService.firstUpdate) return await this.subscribeOnce();
	}

	socketSubscription() {
		//console.log("ChatService subscribing to socket.");
		this.getMessages().subscribe(
			_ => {
					this.think(_);
			},
		);
		ChatService.doneOnce = true;
		this.requestUpdate();
	}

	requestUpdate() {
		//console.log("Requesting get_rooms");

		this.socket.emit('chat', "get_rooms");
	}

	putUserInRoom(room: ChatRoom, flush: boolean = true): ChatRoom
	{
		if (!this.user || !room || !room.user) return room;
		let isIn: boolean = false;
		for (const user of room.user)
			if (user == this.user.intraId)
				isIn = true;
		if (!isIn)
		{
			console.log("Putting user in the room!");
			room.user.push(this.user.intraId);
			if (flush)
				this.roomChanged(room);
			return room;
		}
		return room;
	}

	roomChanged(room: ChatRoom)
	{
		this.socket.emit('chat', {
			'room_changed': room
		});
	}

	sendMessage(chatMessage: ChatMessage) {
		//console.log("Chat emitting.");
		this.socket.emit('chat', chatMessage);
	}

	roomById(roomId?: string): ChatRoom {
		if (!roomId || !ChatService.allRooms || !ChatService.allRooms.length) return {} as ChatRoom;
		for (const room of ChatService.allRooms)
			if (room.id == roomId)
				return room;
		return {} as ChatRoom;
	}

	getOrInitChatRoom(roomId: string|null): ChatRoom {
		if (!roomId)
		{
			// Create new chatRoom, UNMOCK TODO
			return CHAT_ROOM[0];
			// then redirect to /chat/new-room-hash
		}
		return this.roomById(roomId);
	}

	async getVisibleChatRooms(intraId: string|undefined): Promise<ChatRoom[]> {
		if (!ChatService.firstUpdate)
		{
			await new Promise(resolve => setTimeout(resolve, 1000));
			return await this.getVisibleChatRooms(intraId);
		}
		let out: ChatRoom[] = [];
		let put: boolean = false;
		for (const room of ChatService.allRooms)
		{
			put = false;
			if (!room.isPrivate)
				put = true;
			for (const u in room.admin)
				if (room.admin[u] == intraId)
					put = true;
			if (put)
				out.push(room);
		}
		return out;
	}

	userIsInChat(roomId?: string, intraId?: string): boolean
	{
		if (!roomId || !intraId) return false;
		const room = this.roomById(roomId);
		for (const roomIntraId of room.user)
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

	testPrivatePasswordGenLink(myPassword: string): string|null {
		for (const room of ChatService.allRooms)
			if (room.isPrivate && room.password == myPassword)
				return room.id;
		return null;
	}

	testPasswordUnique(myRoom: ChatRoom): boolean {
		for (const room of ChatService.allRooms)
		{
			console.log("Comparing", room.password, myRoom.password);
			if (room.id != myRoom.id && room.password == myRoom.password)
			{
				console.log("Returning false");
				return false;
			}
		}
		return true;
	}

	revokeAdmin(roomId: string|null|undefined, intraId: string) {
		if (!roomId) return;
		let theRoom = this.roomById(roomId);
		let newAdmin: string[] = [];
		for (const adminId of theRoom.admin)
			if (adminId != intraId)
				newAdmin.push(adminId);
		if (!newAdmin.length)
			newAdmin = theRoom.user;
		theRoom.admin = newAdmin;
		this.roomChanged(theRoom);
	}

	isAdmin(roomId?: string|null, intraId?: string): boolean
	{
		if (!roomId || !intraId) return false;
		const room = this.roomById(roomId);
		for (const roomIntraId of room.admin)
			if (intraId == roomIntraId)
				return true;
		return false;
	}

	loggedUserIsMuted(roomId?: string): boolean {
		if (!this.user || !roomId) return false;
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
			//console.log("Mock emitting.");
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
