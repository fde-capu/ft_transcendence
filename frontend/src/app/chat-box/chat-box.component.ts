import { Component, Input } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { User } from '../user';
import { ActivatedRoute, ParamMap, RoutesRecognized } from '@angular/router';
import { InvitationService } from '../invitation.service';

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
		public invitationService: InvitationService,
	) {}
	chatRoom: ChatRoom = {} as ChatRoom;
	windowTitle = "CHAT";
	windowName = "";
	windowExtras = "";
	optionsOn = false;
	usersOutOfChat: User[] = []; // Everyone online minus PC minus who is already in.
	usersInChat: User[] = [];
	done: Boolean = false;
	user?: User;
	id?: string|null;
	iAmAdmin: boolean = false;
	firstTime: boolean = true;

	ngOnInit() {
		// TODO: Check for querystring empty: it means its a new creation.
		// In this case (empty query):
		//		Async await call to endpoint requiring new room.
		//		...when its done, redirect to "/chat/chatId?optionsOn=true".
		// If there is a query, continue:
		this.getUserAndStuff();
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
		//console.log("ChatBox Init");
		this.id = this.route.snapshot.paramMap.get('roomId');
		this.chatRoom = this.chatService.getOrInitChatRoom(this.id);
		// ^ If it is a new room (roomId is null), the route will actualy
		// be deceipt by the ChatService, by consequence the component will
		// reload, and the param roomId will be present.
		this.chatRoom = this.chatService.putUserInRoom(this.chatRoom);
		await new Promise(resolve => setTimeout(resolve, 1000));
		// ^ Some time to circulate the information.
		this.updateRoomRecursive();
		this.checkAdminRecursive()
		this.imprintRecursive();
		this.done = true;
	}

	async updateRoomRecursive() {
		if (!this.id) {
			//console.log("A1");
			await new Promise(resolve => setTimeout(resolve, 500));
			//console.log("A2");
			await this.updateRoomRecursive();
		} else {
			this.chatRoom = this.chatService.roomById(this.id);
			//console.log("A3");
			if (this.chatService.hasNews() || this.firstTime)
				this.usersInChat = await this.userService.intraIdsToUsers(this.chatRoom.user);
			this.firstTime = false;
			//console.log("A4");
			await new Promise(resolve => setTimeout(resolve, 870));
			this.updateRoomRecursive();
		}
	}

	async checkAdminRecursive() {
		if (!this.user) return;
		this.iAmAdmin = this.chatService.isAdmin(this.id, this.user.intraId);
		if (this.iAmAdmin || (!this.chatRoom.isPrivate && !this.chatRoom.password))
			this.getOutOfChatUsersRecursiveOnce();
		//console.log("A6");
		await new Promise(resolve => setTimeout(resolve, 9876));
		//console.log("A7");
		await this.checkAdminRecursive();
	}

	async getOutOfChatUsersRecursiveOnce() {
		this.chatService.getOutOfChatUsers(this.chatRoom.id).subscribe(
			outChat => {
				console.log("Got out-of-chat users.", outChat);
				this.usersOutOfChat = outChat;
			}
		);
	}

	emit() {
		//console.log("Noticed room changed.");
		this.chatService.roomChanged(this.chatRoom);
	}

	async emitIfUnique() {
		if (this.chatRoom.password
		&& !this.chatService.testPasswordUnique(this.chatRoom))
		{
			let saveTypedPassword = this.chatRoom.password;
			this.chatRoom.password = "INVALID! Try another!"; // If its invalid because is repeated, then user knows some room has to have this password!...
			this.fun.blink('password');
			await new Promise(resolve => setTimeout(resolve, 500));
			this.fun.blink('password');
			await new Promise(resolve => setTimeout(resolve, 500));
			this.fun.blink('password');
			await new Promise(resolve => setTimeout(resolve, 500));
			this.chatRoom.password = saveTypedPassword;
			this.fun.focus('password');
			return ;
		}
		this.emit();
	}

	async imprintRecursive() {
		this.windowName = this.windowTitle + ": " + this.chatRoom.name;
		this.windowExtras = ""
		+ (this.chatRoom.isPrivate ? "PRIVATE" : "PUBLIC")
		+ " "
		+ (this.chatRoom.password ? "PROTECTED" : "")
		await new Promise(resolve => setTimeout(resolve, 1300));
		this.imprintRecursive();
	}

	doInvitationToThisRoom(toUser: User) {
		if (!this.user) return;
		this.invitationService.invite({
			from: this.user.intraId,
			to: toUser.intraId,
			type: this.windowName,
			route: '/chat/' + this.chatRoom.id,
			isReply: false
		});
	}

	isBlocked(victim: User): boolean {
		if (!this.chatRoom?.blocked?.length) return false;
		for (const intraId of this.chatRoom.blocked)
			if (intraId == victim.intraId)
				return true;
		return false;
	}

	onClose() {
		if (this.optionsOn)
		{
			return this.onMenu();
		}
		else
		{
			this.chatService.removeUserFromRoom(this.chatRoom);
		}
	}

	onMenu() {
		this.optionsOn = !this.optionsOn;
	}

	switchPrivacy() {
		this.chatRoom.isPrivate = !this.chatRoom.isPrivate;
		this.emit();
	}

	cleanPassword() {
		this.chatRoom.password = "";
		this.emit();
	}

	isAdmin(intraId?: string): boolean {
		return this.chatService.isAdmin(this.id, intraId);
	}

	revokeAdmin() {
		if (!this.user) return;
		this.iAmAdmin = false; // Faster rendering.
		this.chatService.revokeAdmin(this.id, this.user?.intraId);
	}

	isMe(intraId: string): boolean {
		return this.user?.intraId === intraId;
	}
}
// TODO Open user profile when clicking name.
