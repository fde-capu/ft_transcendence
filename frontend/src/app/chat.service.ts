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

@Injectable({
  providedIn: 'root'
})
export class ChatService {
	private roomsUrl = 'http://localhost:3000/chatrooms/';
	static user?: User;
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
		private readonly fun: HelperFunctionsService,
	) {
		this.getUser();
		this.subscribeOnce();
	}

	async getUser(): Promise<User> {
		if (ChatService.user) return ChatService.user;
		this.userService.getLoggedUser().subscribe(
			backUser => { 
				if (backUser)
					ChatService.user = backUser;
			}
		)
		await new Promise(resolve => setTimeout(resolve, 431));
		return this.getUser();
	}

	think(msg: any)
	{
		//console.log("Thinking about: ", msg);
		this.gotNews = true;
		if (msg.payload.roomId) // This checks if is a simple message.
		{
			for (const room of ChatService.allRooms)
				if (room.id == msg.payload.roomId)
				{
					// Now see if is not private-and-owned-by-others,
					// etc., a good place to displace the sensible
					// information (irrelevant to user, even). This way,
					// they would not actually known by ChatService.allRooms.
					// However, this does not mean that the information
					// has not arrived here at frontend.
					if
					(
						(
								this.userIsInChat(room.id, ChatService.user?.intraId)
							||  msg.payload.to == ChatService.user
							||  msg.payload.from == ChatService.user
						) && !this.haveIBlocked(msg.payload.user.intraId)
					) this.messageList.next(msg.payload);
				}
		}
		if (msg.payload.update_rooms)
		{
			//console.log("Setting allRooms from to", ChatService.allRooms, msg.payload.update_rooms);
			ChatService.allRooms = msg.payload.update_rooms;
		}
	}

	haveIBlocked(intraId:string):boolean{
		//console.log("Have I blocked", intraId);
		if (!ChatService.user) return false;
		return this.fun.isStringInArray(intraId, ChatService.user.blocks);
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

	async newRoom(users: string[]): Promise<[string, string]> {
		let newRoomId = this.fun.randomWord(128);
		let newRoomName = this.fun.funnyName();
		let room = {
			id: newRoomId,
			name: newRoomName,
			user: users,
			admin: users,
			isPrivate: true
		};
		this.roomChanged(room);
		await new Promise(resolve => setTimeout(resolve, 1007));
		return [ newRoomId, newRoomName ];
	}

	roomChanged(room: ChatRoom)	{
		this.socket.emit('chat', {
			'room_changed': room
		});
		this.requestUpdate();
	}

	removeRoom(roomId: string) {
		let out: ChatRoom[] = [];
		for (const room of ChatService.allRooms)
			if (room.id != roomId)
				out.push(room);
		//console.log("Removind allRooms from to", ChatService.allRooms, out);
		ChatService.allRooms = out;
		this.socket.emit('chat', {
			'room_gone': roomId
		});
	}

	logOutAllRooms(intraId: string) {
		for (const i in ChatService.allRooms) {
			let newRoom: ChatRoom = ChatService.allRooms[i];
			let newUsers: string[] = [];
			for (const user of newRoom.user)
				if (user != intraId)
					newUsers.push(user);
			if (newUsers.length != newRoom.user.length) {
				newRoom.user = newUsers;
				this.roomChanged(newRoom);
			}
		}
	}

	getOutOfAnyChat() {
		//console.log("getting out of any chat");
		this.userService.getLoggedUser().subscribe(_=>{
			this.logOutAllRooms(_.intraId)
		});
	}

	async putUserInRoom(room: ChatRoom, flush: boolean = true): Promise<ChatRoom> {
		if (!room || !ChatService.user) return {} as ChatRoom;
		if (!this.fun.isStringInArray(ChatService.user.intraId, room.user))
		{
			//console.log("Putting user in the room!", ChatService.user.intraId);
			if (!room.user) room.user = [];
			room.user.push(ChatService.user.intraId);
			if (flush)
				this.roomChanged(room);
		}
		return room;
	}

	sendMessage(chatMessage: ChatMessage) {
		//console.log("Chat emitting.");
		this.socket.emit('chat', chatMessage);
	}


	roomById(roomId?: string): ChatRoom|undefined {
		//console.log("roomById", roomId, ChatService.allRooms);
		if (!roomId || !ChatService.allRooms || !ChatService.allRooms.length) undefined;
		for (const room of ChatService.allRooms)
			if (room.id == roomId)
				return room;
		return undefined;
	}

	async getVisibleChatRooms(intraId: string|undefined): Promise<ChatRoom[]> {
		if (!ChatService.isConnected)
		{
			await new Promise(resolve => setTimeout(resolve, 253));
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
		return this.fun.isStringInArray(intraId, room?.user);
	}

	getOutOfChatUsers(roomId?: string): Observable<User[]> {
		if (!roomId) return of([]);
		let response = this.userService.getAvailableUsers()
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

	revokeAdmin(roomId: string|null|undefined, intraId: string) {
		if (!roomId) return;
		let theRoom = this.roomById(roomId);
		if (!theRoom) return;
		let newAdmin: string[] = [];
		for (const adminId of theRoom.admin)
			if (adminId != intraId)
				newAdmin.push(adminId);
		if (!newAdmin.length) {
			if (theRoom.user && theRoom.user.length <= 1) {
				this.removeRoom(roomId);
				this.router.navigate(['/rooms']);
				return ;
			}
			// ^ If there is no one left to be administrator,
			//   the room is destroyed.
			for (const user of theRoom.user)
				if (user != intraId)
					newAdmin.push(user);
			// ^ If the only admin revokes, everyone in the room
			//   becomes admin!
		}
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

	getMessages() {
		//console.log("Chat service getting from socket.");
		return this.socket.fromEvent<any>('chat');
	}

	isUserBlocked(intraId: string, room: ChatRoom): boolean {
		return this.fun.isStringInArray(intraId, room.blocked);
	}

	isUserMuted(intraId: string, room: ChatRoom): boolean {
		return this.fun.isStringInArray(intraId, room.muted);
	}

	isCurrentUserBlockedByRoomId(roomId: string): boolean {
		if (!ChatService.user) return false;
		let chatRoomTest = this.roomById(roomId);
		if (chatRoomTest)
			return this.isUserBlocked(ChatService.user.intraId, chatRoomTest);
		return false;
	}

	isCurrentUserBlocked(room: ChatRoom): boolean {
		if (!ChatService.user) return false;
		return this.isUserBlocked(ChatService.user.intraId, room);
	}

	isCurrentUserMuted(room: ChatRoom): boolean {
		if (!ChatService.user) return false;
		return this.isUserMuted(ChatService.user.intraId, room);
	}

	// Don't mess with this function!
	unTIG(tigged: string, tigRoom: ChatRoom, self: any = this) {
		for (const room of ChatService.allRooms)
			if (room.id == tigRoom.id)
			{
				let newBlocks: string[] = [];
				if (!room.blocked || !room.blocked.length) return;
				for (const user of room.blocked)
					if (user != tigged)
						newBlocks.push(user);
				room.blocked = newBlocks;
				self.roomChanged(room);
			}
	}

	// Don't mess with this function!
	TIG(tigged: string, tigRoom: ChatRoom) {
		const ONE_MINUTE: number = 60 * 1000;
		for (const room of ChatService.allRooms)
			if (room.id == tigRoom.id) {
				if (!room.blocked)
					room.blocked = [];
				room.blocked.push(tigged);
				this.roomChanged(room);
				const self = this;
				setTimeout(function(tigged: string, tigRoom: ChatRoom){
					self.unTIG(tigged, tigRoom, self);
				}, ONE_MINUTE, tigged, tigRoom, this);
			}
	}

	// Don't mess with this function!
	unMute(muted: string, muteRoom: ChatRoom, self: any = this) {
		for (const room of ChatService.allRooms)
			if (room.id == muteRoom.id)
			{
				let newMutes: string[] = [];
				if (!room.muted || !room.muted.length) return;
				for (const user of room.muted)
					if (user != muted)
						newMutes.push(user);
				room.muted = newMutes;
				self.roomChanged(room);
			}
	}

	// Don't mess with this function!
	muteUser(muted: string, muteRoom: ChatRoom) {
		const ONE_MINUTE: number = 60 * 1000;
		for (const room of ChatService.allRooms)
			if (room.id == muteRoom.id) {
				if (!room.muted)
					room.muted = [];
				room.muted.push(muted);
				this.roomChanged(room);
				const self = this;
				setTimeout(function(muted: string, muteRoom: ChatRoom){
					self.unMute(muted, muteRoom, self);
				}, ONE_MINUTE, muted, muteRoom, this);
			}
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
			// ^ Yikes! Don't show if any bug! TODO (comment line above?)

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

