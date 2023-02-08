import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { USERS } from '../mocks';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	@Input() user: User = {} as User;
	ANOTHERUSERMOCK: User = USERS[7];

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
