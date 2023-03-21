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
	user?: User;
	constructor(private userService: UserService) {};
	ngOnInit(): void {
		this.getUser();
		this.getOnlineUsers();
	}
	getUser(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => { 
				this.user = backUser;
				this.userService.setStatus("ONLINE");
			}
		)
	}
	async getOnlineUsers() {
		this.userService.getOnlineUsers()
			.subscribe(users => {
				let out = [];
				for (const u of users)
					if (u.intraId != this.user?.intraId)
						out.push(u);
				this.users = out;
			});
		await new Promise(resolve => setTimeout(resolve, 3399 + (Math.random() * 10234)));
		// ^ Lazy update so the pop-up don't keep disapearing too often.
		await this.getOnlineUsers();
	}
}
