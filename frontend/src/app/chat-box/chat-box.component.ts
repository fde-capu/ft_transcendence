import { Component, Input } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { User } from '../user';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent {
	constructor (
		public chatService: ChatService,
		public userService: UserService,
		public fun: HelperFunctionsService
	) {}
	chatRoomOn = true; // After last merge, is this in user?
	chatRoom: ChatRoom = {} as ChatRoom;
	windowTitle = "CHAT";
	windowName = "";
	windowExtras = "";
	optionsOn = true; // Initialize to true only if is querystrin
	usersOnChat: User[] = []; // Everyone that is logged on the room.
	usersOutOfChat: User[] = []; // Everyone online minus PC minus who is already in.
	done: Boolean = false;
	@Input() user: User | undefined = undefined;

	ngOnInit() {
		// TODO: Check for querystring empty: it means its a new creation.
		// In this case (empty query):
		//		Async await call to endpoint requiring new room.
		//		...when its done, redirect to "/chat/chatId?optionsOn=true".
		// If there is a query, continue:
		this.getUser();
		this.socketSubscription();
		this.chatService.mockChat(); // TODO REMOVE XXX

		this.chatService.getChatRoom().subscribe(
			chatRoom => {
				this.chatRoom = chatRoom;
				this.imprint();
			}
		);
		this.chatService.getInChatUsers().subscribe(
			inChat => {
				this.usersOnChat = inChat;
				this.imprint();
			}
		);
		this.chatService.getOutOfChatUsers().subscribe(
			outChat => {
				this.usersOutOfChat = outChat;
				this.imprint();
			}
		);

		this.done = true;
		this.imprint();
	}

	getUser(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => { this.user = backUser; }
		)
	}

	socketSubscription() {
		console.log("Chat subscribing.");
		this.chatService.getMessages().subscribe(
			_ => {
				console.log("Chat subscription got", _.payload);
				this.chatService.add(_.payload);
			},
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

	isAdmin(user: User | undefined = this.user): boolean {
		for (const admin of this.chatRoom.admin)
			if (admin == user)
				return true;
		return user == this.user; // TODO: Remove this line, it's a mock so user is always admin.
		return false;
	}

	isMe(user: User): boolean {
		return user === this.user;
	}
}
// TODO Open user profile when clicking name.
// TODO (BUG): When changing the Room name on one chatbox, the other reamins unchanged.
// TODO (BUG): Subcomponents on chatbox are not getting right with multiple instances.
