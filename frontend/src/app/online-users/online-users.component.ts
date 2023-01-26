import { Component } from '@angular/core';
import { User } from '../user-interface';
import {Router} from "@angular/router"
import { USERS } from '../mocks';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
	constructor(private router: Router) {};
	users = USERS;
	selectedUser?: User;

	onClick(e: Event, user: User): void {
//		TODO: inject a blink() function.

//		TODO;
//		this.router.navigate(['/profile', user.intraId])
	}
}
