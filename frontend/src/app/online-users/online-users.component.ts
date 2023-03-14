import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
	users: User[] = [];
	constructor(private userService: UserService) {};
	ngOnInit(): void {
		this.getOnlineUsers();
	}
	async getOnlineUsers() {
		this.userService.getOnlineUsers()
			.subscribe(users => this.users = users);
		await new Promise(resolve => setTimeout(resolve, 3399));
		await this.getOnlineUsers();
	}
}
