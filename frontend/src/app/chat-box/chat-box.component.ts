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
	optionsOn = true; // Initialize to true only if is querystrin
	usersOnChat: User[] = []; // Everyone that is logged on the room.
	usersOutOfChat: User[] = []; // Everyone online minus PC minus who is already in.
	done: Boolean = false;
	user?: User;

	ngOnInit() {
		// TODO: Check for querystring empty: it means its a new creation.
		// In this case (empty query):
		//		Async await call to endpoint requiring new room.
		//		...when its done, redirect to "/chat/chatId?optionsOn=true".
		// If there is a query, continue:
		this.getUser();
		this.socketSubscription();

		this.chatService.getChatRoom(
			this.route.snapshot.paramMap.get('roomId')
		).subscribe(
			chatRoom => {
				this.chatRoom = chatRoom;
				console.log("ChatBox Init to chatroom", chatRoom);
				this.imprint();
			}
		);

		this.chatService.getInChatUsers().subscribe(
			inChat => {
				this.userService.getMany(inChat).subscribe(_=>{
					this.usersOnChat = _;
				});
				this.imprint();
			}
		);

		this.chatService.getOutOfChatUsers().subscribe(
			outChat => {
				this.userService.getMany(outChat).subscribe(_=>{
					this.usersOutOfChat = _;
				});
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
				if (_.payload.roomId != this.chatRoom.id) {
					console.log("Disregarding message", _.payload);
					return ;
				}
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
		if (!this.chatRoom?.admin?.length || !user || !this.user) return false;
		for (const admin of this.chatRoom.admin)
			if (admin == user.intraId)
				return true;
		return user.intraId == this.user.intraId; // TODO: Remove this line, it's a mock so user is always admin.
		return false;
	}

	isMe(user: User): boolean {
		return user === this.user;
	}
}
// TODO Open user profile when clicking name.
// TODO (BUG): When changing the Room name on one chatbox, the other reamins unchanged.
// TODO (BUG): Subcomponents on chatbox are not getting right with multiple instances.
