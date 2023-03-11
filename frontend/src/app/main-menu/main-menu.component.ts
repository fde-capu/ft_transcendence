import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
	@Input() big = false;
	constructor(
		private readonly userService: UserService,
	) {};
	signOut() {
		this.userService.signOut();
	}
}
