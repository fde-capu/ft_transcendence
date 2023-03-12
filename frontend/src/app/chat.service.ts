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

// TODO: all is mocked. Unmock them!

@Injectable({
  providedIn: 'root'
})
export class ChatService {
	private roomsUrl = 'http://localhost:3000/chatrooms/';
	user: User | undefined = undefined;
	static isConnected: boolean = false;
	static allRooms: ChatRoom[] = [];
	public readonly messageList = new BehaviorSubject<ChatMessage>({} as ChatMessage);
	gotNews: boolean = false;

	constructor(
		private readonly socket: ChatSocket,
		public route: ActivatedRoute,
		private readonly router: Router,
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
		this.gotNews = true;
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
		}
		// maybe create new chat room
		// maybe change users status
		// basically all allRooms updates
		// and messages.
				// for (const room of ChatService.allRooms)
	}

	hasNews(): boolean {
		if (this.gotNews || Math.random() > .9) {
			//              ^ ocasional refreshment to solve race condition,
			//                thus saving cpu.
			this.gotNews = false;
			return true;
		}
		return false;
	}

	// Promise<void> is needed \/ in this case, even being void.
	async subscribeOnce(): Promise<void> {
			await new Promise(resolve => setTimeout(resolve, 500));
		//console.log("static!", ChatService.isConnected);
		if (!ChatService.isConnected)
			this.socketSubscription();
	}

	socketSubscription() {
		//console.log("ChatService subscribing to socket.");
		this.getMessages().subscribe(
			_ => {
					this.think(_);
			},
		);
		ChatService.isConnected = true;
		this.requestUpdate();
	}

	requestUpdate() {
		//console.log("Requesting get_rooms");
		this.socket.emit('chat', "get_rooms");
	}

	newRoom(room: ChatRoom) {
		this.roomChanged(room);
	}

	roomChanged(room: ChatRoom)	{
		this.socket.emit('chat', {
			'room_changed': room
		});
	}

	removeUserFromRoom(room: ChatRoom, flush: boolean = true) {
		if (!this.user || !room || !room.user) return room;
		let newUsers: string[] = [];
		for (const user of room.user)
		{
			console.log("cheking", user, this.user.intraId);
			if (user != this.user.intraId)
				newUsers.push(user);
		}
		console.log("Removing user from room!");
		room.user = newUsers;
		if (flush)
			this.roomChanged(room);
		this.router.navigate(['/rooms']);
		return ; // If not, TS7030, but what the heck!
		// (Even without the router.navigate above).
	}

	putUserInRoom(room: ChatRoom, flush: boolean = true): ChatRoom {
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
		if (!roomId) return {} as ChatRoom;
		return this.roomById(roomId);
	}

	async getVisibleChatRooms(intraId: string|undefined): Promise<ChatRoom[]> {
		if (!ChatService.isConnected)
		{
			await new Promise(resolve => setTimeout(resolve, 250));
			return this.getVisibleChatRooms(intraId);
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
		let response =
		this.userService.getOnlineUsers()
		.pipe(map(
			result => {
				let out: User[] = [];
				for (const user of result)
					if (!this.userIsInChat(roomId, user.intraId))
						out.push(user);
				result = out;
				return result;
			}
		))
		return response;
	}

	testPasswordLink(myPassword: string): string|null {
		for (const room of ChatService.allRooms)
			if (room.password == myPassword)
				return room.id;
		return null;
	}

	testPasswordUnique(myRoom: ChatRoom): boolean {
		for (const room of ChatService.allRooms)
		{
			if (room.id != myRoom.id && room.password == myRoom.password)
				return false;
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
		if (!room || !room.admin || !room.admin.length) return false;
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
