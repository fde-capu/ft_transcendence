import { Component } from '@angular/core';
import { User } from '../user-interface';
import { Router } from "@angular/router"
import { UserService } from '../user.service';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
	users: User[] = []
	selectedUser?: User;
	constructor(private router: Router, private userService: UserService) {};
	ngOnInit(): void {
		this.getUsers();
	}

	getUsers(): void {
		this.userService.getUsers()
			.subscribe(users => this.users = users);
	}

	onClick(e: Event, user: User): void {
//		TODO: inject a blink() function.

//		TODO;
//		this.router.navigate(['/profile', user.intraId])
	}
}
