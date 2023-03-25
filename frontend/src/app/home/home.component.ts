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
	user?: User;

	constructor (
		private userService: UserService
	) {};
	ngOnInit(): void {
		this.getUser();
	}
	getUser() {
		//console.log("Home will set current user async.");
		this.userService.getLoggedUser().subscribe
			( user => {
				this.user = user 
				//console.log("Home got", this.user);
			});
	}
}
