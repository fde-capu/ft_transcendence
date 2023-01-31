import { Component } from '@angular/core';
import { User } from '../user-interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
	constructor (private userService: UserService) {};

	user: User = {} as User;
	isLogged: Boolean = true;
	// ^ TODO: make it into a user.service...
	// ...or accept the user is always logged.

	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => this.user = user);
	}	
}