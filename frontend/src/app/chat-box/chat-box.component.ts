import { Component, Input } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { User } from '../user';
import { ActivatedRoute, ParamMap, RoutesRecognized, Router } from '@angular/router';
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
		private readonly router: Router,
	) {}
	chatRoom: ChatRoom = {} as ChatRoom;
	windowTitle = "CHAT";
	windowName = "";
	windowExtras = "";
	optionsOn = false;
	usersOutOfChat: User[] = []; // Everyone online minus PC minus who is already in.
	usersInChat: User[] = [];
	static ignited: Boolean = false;
	user?: User;
	id?: string|null;
	iAmAdmin: boolean = false;
	invalidNameNotice: boolean = false;
	invalidPasswordNotice: boolean = false;
	lastRoomName: string = "";
	static uid: number = 1;
	uniqueId: number = 0;
	static umap: Map<string, number> = new Map<string, number>;

	ngOnInit() {
		this.getUserAndStuff();
	}

	ngOnDestroy() {
		ChatBoxComponent.ignited = false;
	}

	getUserAndStuff(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => {
				this.user = backUser;
				this.userService.setStatus("INCHAT");
				this.initChatRoom();
			}
		)
	}

	async initChatRoom() {
		//console.log("ChatBox Init");
		ChatBoxComponent.ignited = true;
		this.id = this.route.snapshot.paramMap.get('roomId');
		if (!this.id && this.user)
		{
			let [ newRoomId, newRoomName ] = await this.chatService.newRoom([this.user.intraId]);
			this.router.navigate(['/chat/' + newRoomId]);
			return ;
		}
		if (this.id)
			this.keepTryingToIdentify(this.id);
		// ^ If it is a new room (roomId is null), the route will actualy
		// be deceipt by the ChatService, by consequence the component will
		// reload, and the param roomId will be present.
		this.chatRoom = await this.chatService.putUserInRoom(this.chatRoom);
		if (this.chatRoom.user && this.chatRoom.user.length == 1
			&& this.chatRoom.admin && this.chatRoom.admin.length == 1
			&& this.chatRoom.user[0] == this.chatRoom.admin[0])
			this.optionsOn = true;
		this.uniqueId = ChatBoxComponent.uid++;
		this.updateRoomRecursive();
		this.checkAdminRecursive()
		this.getOutOfChatUsersRecursiveOnce();
		this.imprintRecursive();
	}

	async keepTryingToIdentify(id: string) {
		//console.log("The id is", id);
		const chatRoomTest = this.chatService.roomById(id);
		if (chatRoomTest)
			this.chatRoom = chatRoomTest;
		else {
			await new Promise(resolve => setTimeout(resolve, 345));
			this.keepTryingToIdentify(id);
		}
	}

	async updateRoomRecursive(): Promise<void> {
		if (this.user && this.chatRoom && !this.fun.isStringInArray(this.user.intraId, this.chatRoom.user))
		{
			//console.log("Returning", this.uniqueId);
			return ;
		}
		if (!this.id) {
			//console.log("A1");
			await new Promise(resolve => setTimeout(resolve, 337));
			//console.log("A2");
			return await this.updateRoomRecursive();
		} else {
			let solo = ChatBoxComponent.umap.get(this.id);
			if (!solo || solo < this.uniqueId)
				ChatBoxComponent.umap.set(this.id, this.uniqueId);
			if (solo && solo > this.uniqueId)
				return ;

			let chatRoomTest = this.chatService.roomById(this.id);
			if (!this.chatService.equalRooms(chatRoomTest, this.chatRoom) || !ChatBoxComponent.ignited) {
				//console.log("update", chatRoomTest);
				if (chatRoomTest)
					this.chatRoom = chatRoomTest;
				else
					return;
				//console.log("A3");
				//console.log("Updating users in chat", this.chatRoom);
				this.usersInChat = await this.userService.intraIdsToUsers(this.chatRoom.user);
				//console.log("A4", this.uniqueId, this.chatRoom.name);
			}
			await new Promise(resolve => setTimeout(resolve, 1357));
			this.updateRoomRecursive();
		}
	}

	async checkAdminRecursive() {
		if (!this.user) return;
		this.iAmAdmin = this.chatService.isAdmin(this.id, this.user.intraId);
		//console.log("A6");
		await new Promise(resolve => setTimeout(resolve, 1075));
		//console.log("A7");
		this.checkAdminRecursive();
	}

	async getOutOfChatUsersRecursiveOnce() {
		if (!this.userService.authorized() || !ChatBoxComponent.ignited) return ;
		this.chatService.getOutOfChatUsers(this.chatRoom.id).subscribe(
			outChat => {
				//console.log(this.uniqueId, "Got out-of-chat users.", outChat);
				this.usersOutOfChat = outChat;
			}
		);
		await new Promise(resolve => setTimeout(resolve, 6447));
		this.getOutOfChatUsersRecursiveOnce();
	}

	async allValid() {
		let validName = await this.validateName();
		let validPassword = await this.validatePassword();
		return validName && validPassword;
	}

	async validateAndEmit(): Promise<boolean>{
		if (await this.allValid()) {
			this.emit();
			return true;
		}
		return false;
	}

	saveLastRoomName() {
		this.lastRoomName = this.chatRoom.name;
	}

	async validateName(): Promise<boolean> {
		if (this.fun.validateString(this.chatRoom.name))
			return true;
		else {
			this.invalidNameNotice = true;
			this.fun.blink('invalidNameNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.fun.blink('invalidNameNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.fun.blink('invalidNameNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.invalidNameNotice = false;
			this.chatRoom.name = this.lastRoomName;
			this.fun.focus('name');
			return false;
		}
	}

	emit() {
		//console.log("Noticed room changed.");
		this.chatService.roomChanged(this.chatRoom);
	}

	async validatePassword(): Promise<boolean> {
		//console.log("testing pass", this.chatRoom.password);
		if (
			this.chatRoom.password &&
			!this.fun.validateString(this.chatRoom.password)
		)
		{
			this.invalidPasswordNotice = true;
			this.fun.blink('invalidPasswordNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.fun.blink('invalidPasswordNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.fun.blink('invalidPasswordNotice');
			await new Promise(resolve => setTimeout(resolve, 342));
			this.invalidPasswordNotice = false;
			if (this.fun.validateString(this.chatRoom.name))
				this.fun.focus('password');
			return false;
		}
		return true;
	}

	async imprintRecursive() {
		this.windowName = this.windowTitle + ": " + this.chatRoom.name;
		this.windowExtras = ""
		+ (this.chatRoom.isPrivate ? "PRIVATE" : "PUBLIC")
		+ " "
		+ (this.chatRoom.password ? "PROTECTED" : "")
		await new Promise(resolve => setTimeout(resolve, 1313));
		this.imprintRecursive();
	}

	doInvitationToThisRoom(toUser: User) {
		if (!this.user) return;
		if (this.iAmAdmin)
			this.chatService.unTIG(toUser.intraId, this.chatRoom);
		this.invitationService.invite({
			from: this.user.intraId,
			to: toUser.intraId,
			type: this.windowName,
			route: '/chat/' + this.chatRoom.id,
			isReply: false
		});
	}

	isBlocked(victim: User): boolean {
		if (!this.chatRoom.blocked) return false;
		for (const user of this.chatRoom.blocked)
			if (user == victim.intraId)
				return true;
		return false;
	}

	isMuted(victim: User): boolean {
		if (!this.chatRoom.muted) return false;
		for (const user of this.chatRoom.muted)
			if (user == victim.intraId)
				return true;
		return false;
	}

	promoteThem(promoted: User) {
		this.chatRoom.admin.push(promoted.intraId);
		this.chatService.roomChanged(this.chatRoom);
	}

	async kickThem(kicked: User) {
		this.chatRoom.user = this.fun.removeStringFromArray(kicked.intraId, this.chatRoom.user);
		this.invitationService.notify({
			to: kicked.intraId,
			note: "You have been kicked.",
			route: "/rooms",
			button: this.fun.funnyInnocence(),
			routeBefore: true,
		});
		this.chatService.roomChanged(this.chatRoom);
	}

	tigThem(tigged: User) {
		this.chatRoom.user = this.fun.removeStringFromArray(tigged.intraId, this.chatRoom.user);
		this.invitationService.notify({
			to: tigged.intraId,
			note: "TIG!",
			type: "One minute banned!",
			route: "/rooms",
			button: this.fun.funnyInnocence(),
			routeBefore: true,
		});
		this.chatService.TIG(tigged.intraId, this.chatRoom);
		this.chatService.roomChanged(this.chatRoom);
	}

	muteThem(muted: User) {
		this.invitationService.notify({
			to: muted.intraId,
			note: "SHHHH!",
			type: "One minute muted!",
			button: this.fun.funnyInnocence(),
		});
		this.chatService.muteUser(muted.intraId, this.chatRoom);
		this.chatService.roomChanged(this.chatRoom);
	}

	async onClose() {
		if (this.optionsOn)
			this.onMenu();
		else
			this.router.navigate(['/rooms']);
	}

	async onMenu() {
		if (!this.optionsOn) {
			this.optionsOn = true;
			return ;
		}
		if (await this.validateAndEmit())
			this.optionsOn = false;
	}

	switchPrivacy() {
		this.chatRoom.isPrivate = !this.chatRoom.isPrivate;
		this.validateAndEmit();
	}

	cleanPassword() {
		this.chatRoom.password = "";
		this.validateAndEmit();
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
