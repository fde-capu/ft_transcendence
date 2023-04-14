import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getOnlineUsers();
  }

  async getOnlineUsers() {
    if (!this.userService.authorized() || !UserService.currentIntraId) return;
		this.users = this.userService.getOnlineUsers();
    await new Promise(resolve =>
      setTimeout(resolve, 3333)
    );
    this.getOnlineUsers();
  }
}
