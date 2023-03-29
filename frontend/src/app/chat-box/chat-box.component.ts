import { Component, OnInit } from '@angular/core';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { HelperFunctionsService } from '../helper-functions.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService } from '../invitation.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnInit {
  chatRoom: ChatRoom = {} as ChatRoom;
  windowTitle = 'CHAT';
  windowName = '';
  windowExtras = '';
  optionsOn = false;
  usersOutOfChat: User[] = []; // Everyone online minus PC minus who is already in.
  usersInChat: User[] = [];
  done = false;
  user?: User;
  id?: string | null;
  iAmAdmin = false;
  firstTime = true;
  invalidNameNotice = false;
  invalidPasswordNotice = false;
  lastRoomName = '';

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    public fun: HelperFunctionsService,
    public route: ActivatedRoute,
    public invitationService: InvitationService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // TODO: Check for querystring empty: it means its a new creation.
    // In this case (empty query):
    //		Async await call to endpoint requiring new room.
    //		...when its done, redirect to "/chat/chatId?optionsOn=true".
    // If there is a query, continue:
    this.getUserAndStuff();
  }

  getUserAndStuff(): void {
    this.userService.getLoggedUser().subscribe(backUser => {
      this.user = backUser;
      this.initChatRoom();
    });
  }

  async initChatRoom() {
    this.id = this.route.snapshot.paramMap.get('roomId');
    if (!this.id && this.user) {
      const [newRoomId] = await this.chatService.newRoom([this.user.intraId]);
      this.router.navigate(['/chat/' + newRoomId]);
      return;
    }
    if (this.id) {
      const chatRoomTest = this.chatService.roomById(this.id);
      if (chatRoomTest) this.chatRoom = chatRoomTest;
    }
    // ^ If it is a new room (roomId is null), the route will actualy
    // be deceipt by the ChatService, by consequence the component will
    // reload, and the param roomId will be present.
    this.chatRoom = await this.chatService.putUserInRoom(this.chatRoom);
    if (
      this.chatRoom.user &&
      this.chatRoom.user.length == 1 &&
      this.chatRoom.admin &&
      this.chatRoom.admin.length == 1 &&
      this.chatRoom.user[0] == this.chatRoom.admin[0]
    )
      this.optionsOn = true;
    this.updateRoomRecursive();
    this.checkAdminRecursive();
    this.getOutOfChatUsersRecursiveOnce();
    this.imprintRecursive();
    this.done = true;
  }

  async updateRoomRecursive() {
    if (!this.id) {
      await new Promise(resolve => setTimeout(resolve, 2209));
      await this.updateRoomRecursive();
    } else {
      const chatRoomTest = this.chatService.roomById(this.id);
      if (chatRoomTest) this.chatRoom = chatRoomTest;
      if (this.chatService.hasNews() || this.firstTime)
        this.usersInChat = await this.userService.intraIdsToUsers(
          this.chatRoom.user
        );
      this.firstTime = false;
      await new Promise(resolve => setTimeout(resolve, 870));
      this.updateRoomRecursive();
    }
  }

  async checkAdminRecursive() {
    if (!this.user) return;
    this.iAmAdmin = this.chatService.isAdmin(this.id, this.user.intraId);
    await new Promise(resolve => setTimeout(resolve, 1075));
    this.checkAdminRecursive();
  }

  async getOutOfChatUsersRecursiveOnce() {
    this.chatService.getOutOfChatUsers(this.chatRoom.id).subscribe(outChat => {
      this.usersOutOfChat = outChat;
    });
    await new Promise(resolve => setTimeout(resolve, 7447));
    this.getOutOfChatUsersRecursiveOnce();
  }

  async allValid() {
    const validName = await this.validateName();
    const validPassword = await this.validatePassword();
    return validName && validPassword;
  }

  async validateAndEmit(): Promise<boolean> {
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
    if (this.fun.validateString(this.chatRoom.name)) return true;
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
    this.chatService.roomChanged(this.chatRoom);
  }

  async validatePassword(): Promise<boolean> {
    if (
      this.chatRoom.password &&
      !this.fun.validateString(this.chatRoom.password)
    ) {
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
    this.windowName = this.windowTitle + ': ' + this.chatRoom.name;
    this.windowExtras =
      '' +
      (this.chatRoom.isPrivate ? 'PRIVATE' : 'PUBLIC') +
      ' ' +
      (this.chatRoom.password ? 'PROTECTED' : '');
    await new Promise(resolve => setTimeout(resolve, 1313));
    this.imprintRecursive();
  }

  doInvitationToThisRoom(toUser: User) {
    if (!this.user) return;
    if (this.iAmAdmin) this.chatService.unTIG(toUser.intraId, this.chatRoom);
    this.invitationService.invite({
      from: this.user.intraId,
      to: toUser.intraId,
      type: this.windowName,
      route: '/chat/' + this.chatRoom.id,
      isReply: false,
    });
  }

  isBlocked(victim: User): boolean {
    if (!this.chatRoom.blocked) return false;
    for (const user of this.chatRoom.blocked)
      if (user == victim.intraId) return true;
    return false;
  }

  isMuted(victim: User): boolean {
    if (!this.chatRoom.muted) return false;
    for (const user of this.chatRoom.muted)
      if (user == victim.intraId) return true;
    return false;
  }

  promoteThem(promoted: User) {
    this.chatRoom.admin.push(promoted.intraId);
    this.chatService.roomChanged(this.chatRoom);
  }

  kickThem(kicked: User) {
    const innocents: string[] = [];
    for (const suspect of this.chatRoom.user)
      if (suspect != kicked.intraId) innocents.push(suspect);
    this.chatRoom.user = innocents;
    this.invitationService.notify({
      to: kicked.intraId,
      note: 'You have been kicked.',
      route: '/rooms',
      button: this.fun.funnyInnocence(),
    });
    this.chatService.roomChanged(this.chatRoom);
  }

  tigThem(tigged: User) {
    const innocents: string[] = [];
    for (const suspect of this.chatRoom.user)
      if (suspect != tigged.intraId) innocents.push(suspect);
    this.chatRoom.user = innocents;
    this.invitationService.notify({
      to: tigged.intraId,
      note: 'TIG!',
      type: 'One minute banned!',
      route: '/rooms',
      button: this.fun.funnyInnocence(),
    });
    this.chatService.TIG(tigged.intraId, this.chatRoom);
    this.chatService.roomChanged(this.chatRoom);
  }

  muteThem(muted: User) {
    this.invitationService.notify({
      to: muted.intraId,
      note: 'SHHHH!',
      type: 'One minute muted!',
      button: this.fun.funnyInnocence(),
    });
    this.chatService.muteUser(muted.intraId, this.chatRoom);
    this.chatService.roomChanged(this.chatRoom);
  }

  async onClose() {
    if (this.optionsOn) this.onMenu();
    else this.router.navigate(['/rooms']);
  }

  async onMenu() {
    if (!this.optionsOn) {
      this.optionsOn = true;
      return;
    }
    if (await this.validateAndEmit()) this.optionsOn = false;
  }

  switchPrivacy() {
    this.chatRoom.isPrivate = !this.chatRoom.isPrivate;
    this.validateAndEmit();
  }

  cleanPassword() {
    this.chatRoom.password = '';
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
