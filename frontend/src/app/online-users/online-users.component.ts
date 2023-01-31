import { Component } from '@angular/core';
import { User } from '../user-interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
	users: User[] = []
	selectedUser?: User;
	constructor(private userService: UserService) {};
	ngOnInit(): void {
		this.getOnlineUsers();
	}

	getOnlineUsers(): void {
		this.userService.getOnlineUsers()
			.subscribe(users => this.users = users);
	}

	onClick(e: Event): void {
		console.log('user clicked:', e);
//		TODO;
//		this.router.navigate(['/profile', user.intraId])
	}
}
