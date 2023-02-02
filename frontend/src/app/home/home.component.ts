import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	user: User = {} as User;
	constructor (
		private userService: UserService
	) {};
	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => this.user = user);
	}

}
