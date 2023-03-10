import { Component, Input } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { User } from '../user';
import { ActivatedRoute, ParamMap, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
	constructor (
		public chatService: ChatService,
		public userService: UserService,
		public fun: HelperFunctionsService,
		public route: ActivatedRoute,
	) {}
	chatRoom: ChatRoom = {} as ChatRoom;
	windowTitle = "CHAT";
	windowName = "";
	windowExtras = "";
	optionsOn = false;
	usersOutOfChat: User[] = []; // Everyone online minus PC minus who is already in.
	done: Boolean = false;
	user?: User;
	id?: string|null;

	ngOnInit() {
		// TODO: Check for querystring empty: it means its a new creation.
		// In this case (empty query):
		//		Async await call to endpoint requiring new room.
		//		...when its done, redirect to "/chat/chatId?optionsOn=true".
		// If there is a query, continue:
		this.getUserAndStuff();
		// ^ Not the best place, maybe everyone should subscribe once and get all messages.
	}

	getUserAndStuff(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => {
				this.user = backUser;
				this.initChatRoom();
			}
		)
	}

	async initChatRoom() {
		console.log("ChatBox Init to chatroom", this.chatRoom);
		this.id = this.route.snapshot.paramMap.get('roomId');
		await this.chatService.subscribeOnce();

		this.chatRoom = this.chatService.getOrInitChatRoom(
			this.id	
		);

		this.getOutOfChatUsers();
		this.done = true;
		this.imprint();
	}

	getOutOfChatUsers(): void {
		this.chatService.getOutOfChatUsers().subscribe(
			outChat => {
				this.usersOutOfChat = outChat;
			}
		);
	}

	imprint() {
		this.windowName = this.windowTitle + ": " + this.chatRoom.name;
		this.windowExtras = ""
		+ (this.chatRoom.isPrivate ? "PRIVATE" : "PUBLIC")
		+ " "
		+ (this.chatRoom.password ? "PROTECTED" : "")
	}

	onClose() {
		if (this.optionsOn)
		{
			return this.onMenu();
		}
		alert (`
			// TODO: User exits Chat Room, the window closes.
			// If they are the only admin, who takes administration?
		`);
	}

	onMenu() {
		this.optionsOn = !this.optionsOn;
	}

	switchPrivacy() {
		this.chatRoom.isPrivate = !this.chatRoom.isPrivate;
		this.imprint();
	}

	cleanPassword() {
		this.chatRoom.password = "";
		this.imprint();
	}

	isAdmin(intraId?: string): boolean {
		if (!this.user) return false;
		if (!intraId)
			return this.chatService.isAdmin(this.id, this.user.intraId);
		return this.chatService.isAdmin(this.id, intraId);
	}

	isMe(intraId: string): boolean {
		return this.user?.intraId === this.user;
	}
}
// TODO Open user profile when clicking name.
// TODO (BUG): When changing the Room name on one chatbox, the other reamins unchanged.
// TODO (BUG): Subcomponents on chatbox are not getting right with multiple instances.

