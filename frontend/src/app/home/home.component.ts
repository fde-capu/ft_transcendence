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
	@Input() user: User | undefined = undefined;

	constructor (
		private userService: UserService
	) {};
	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		console.log("Home will subscribe current user.");
		this.userService.getLoggedUser()
			.subscribe(user => { 
				this.user = user;
				console.log("home know the current user", this.user);
			});
	}
}
