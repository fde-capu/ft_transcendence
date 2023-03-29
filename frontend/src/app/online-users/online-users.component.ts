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
    this.userService.getOnlineUsers().subscribe(users => (this.users = users));
    await new Promise(resolve =>
      setTimeout(resolve, 3399 + Math.random() * 10234)
    );
    // ^ Lazy update so the pop-up don't keep disapearing too often.
    await this.getOnlineUsers();
  }
}
