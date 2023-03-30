import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatRoom } from '../chat-room';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-chat-room-list',
  templateUrl: './chat-room-list.component.html',
  styleUrls: ['./chat-room-list.component.css'],
})
export class ChatRoomListComponent implements OnInit {
  user?: User;
  visibleRooms: ChatRoom[] = [];
  password = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    public fun: HelperFunctionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  async getChatRooms() {
    this.visibleRooms = await this.chatService.getVisibleChatRooms(
      this.user?.intraId
    );
    for (const room of this.visibleRooms)
      if (
        this.chatService.isAdmin(room.id, this.user?.intraId) &&
        room.password
      )
        this.password.set(room.id, room.password);
    await new Promise(resolve => setTimeout(resolve, 1001));
    this.getChatRooms();
  }

	getCurrentUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => {
				this.user = user;
				this.userService.setStatus("ONLINE");
				this.getChatRooms();
			});
	}

  isCurrentUserBlocked(room: ChatRoom): boolean {
    return this.chatService.isCurrentUserBlocked(room);
  }

  isCurrentUserMuted(room: ChatRoom): boolean {
    return this.chatService.isCurrentUserMuted(room);
  }

  async submitEntrance(room: ChatRoom): Promise<void> {
    if (!this.password.get(room.id)) this.fun.focus('pass' + room.id);
    else {
      const block = this.chatService.isCurrentUserBlocked(room);
      if (this.password.get(room.id) != room.password || block) {
        const message = block
          ? ' [ !!! YOU ARE BLOCKED !!! ] '
          : ' [ !!! WRONG !!! ]';
        this.password.set(room.id, message);
        this.fun.blink('pass' + room.id);
        this.fun.blink('btn' + room.id);
        await new Promise(resolve => setTimeout(resolve, 342));
        this.fun.blink('pass' + room.id);
        this.fun.blink('btn' + room.id);
        await new Promise(resolve => setTimeout(resolve, 342));
        this.fun.blink('pass' + room.id);
        this.fun.blink('btn' + room.id);
        await new Promise(resolve => setTimeout(resolve, 342));
        this.password.set(room.id, '');
        this.fun.focus('pass' + room.id);
        return;
      }
      this.router.navigate(['/chat/' + room.id]);
    }
  }

  isAdmin(intraId?: string, roomId?: string): boolean {
    return this.chatService.isAdmin(roomId, intraId);
  }
}
