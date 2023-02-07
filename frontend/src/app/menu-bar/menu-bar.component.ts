import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
	constructor (private userService: UserService) {};

	user: User = {} as User;
	score: Number = 339887; // TODO: link to user score. Should this always come with the User interface?
	isLogged: Boolean = true;
	// ^ TODO: make it into a user.service...
	// ...or accept the user is always logged.
	menuOpen: Boolean = false;

	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => this.user = user);
	}
	onClickBurger(): void {
		this.menuOpen = !this.menuOpen;
	}
	menuOff(): void { 
		this.menuOpen = false;
	}
}
