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
		this.id = this.route.snapshot.paramMap.get('roomId');
		if (!this.id && this.user)
		{
			let [ newRoomId, newRoomName ] = await this.chatService.newRoom([this.user.intraId]);
			this.router.navigate(['/chat/' + newRoomId]);
			return ;
		}
		// ^ If it is a new room (roomId is null), the route will actualy
		// be deceipt by the ChatService, by consequence the component will
		// reload, and the param roomId will be present.
		this.keepTryingToIdentify(this.id);
		this.chatRoom = await this.chatService.putUserInRoom(this.chatRoom);
		if (this.chatRoom.user && this.chatRoom.user.length == 1
			&& this.chatRoom.admin && this.chatRoom.admin.length == 1
			&& this.chatRoom.user[0] == this.chatRoom.admin[0])
			this.optionsOn = true;
		this.uniqueId = ChatBoxComponent.uid++;
		this.updateRoomRecursive();
		this.checkAdminRecursive()
		this.getOutOfChatUsers();
		ChatBoxComponent.ignited = true;
		this.imprintRecursive();
	}

	async keepTryingToIdentify(id: string|null) {
		//console.log("keepTryingToIdentify");
		if (id) {
			const chatRoomTest = this.chatService.roomById(id);
			if (chatRoomTest) {
				this.chatRoom = chatRoomTest;
				this.chatRoom.user = chatRoomTest.user;
				await new Promise(resolve => setTimeout(resolve, 5234));
			}
		}
		await new Promise(resolve => setTimeout(resolve, 234));
		this.keepTryingToIdentify(id);
	}

	async updateRoomRecursive(): Promise<void> {
		if (this.chatRoom) {
			if (!this.chatRoom.user) this.chatRoom.user = [];
			this.usersInChat = await this.userService.intraIdsToUsers(this.chatRoom.user);
		}
		await new Promise(resolve => setTimeout(resolve, this.id ? 5357 : 123));
		this.updateRoomRecursive();
	}
;
	async checkAdminRecursive() {
		if (!this.user) {} else {
			this.iAmAdmin = this.chatService.isAdmin(this.id, this.user.intraId);
		}
		await new Promise(resolve => setTimeout(resolve, this.id ? 5075 : 135));
		this.checkAdminRecursive();
	}

	async getOutOfChatUsers() {
		if (!this.userService.authorized() || !ChatBoxComponent.ignited)
		{} else {
			this.chatService.getOutOfChatUsers(this.chatRoom.id).subscribe(
				outChat => {
					//console.log(this.uniqueId, "Got out-of-chat users.", outChat);
					this.usersOutOfChat = outChat;
				}
			);
		}
		await new Promise(resolve => setTimeout(resolve, this.id ? 6447 : 653));
		this.getOutOfChatUsers();
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
			await this.fun.blink3('invalidNameNotice');
			this.invalidNameNotice = false;
			this.chatRoom.name = this.lastRoomName;
			this.fun.focus('name');
			return false;
		}
	}

	emit() {
		console.log("Noticed room changed.",
			"users", this.chatRoom.user,
			"mutes", this.chatRoom.muted,
			"blocks", this.chatRoom.blocked);
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
			await this.fun.blink3('invalidPasswordNotice');
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
		if (this.chatRoom.isPrivate)
			this.chatRoom.password = "";
		this.validateAndEmit();
	}

	cleanPassword() {
		this.chatRoom.password = "";
		this.validateAndEmit();
	}

	isAdmin(intraId?: string): boolean {
		if (intraId)
			return this.fun.isStringInArray(intraId, this.chatRoom.admin);
		return false;
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
