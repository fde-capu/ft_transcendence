import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css']
})
export class UserBarComponent {
	@Input() user?: User;
	isFriend: boolean = false;
	constructor(
		private userService: UserService,
	){}
	ngOnChanges() {
		this.checkFriendship();
	}
	checkFriendship() {
		this.isFriend=this.userService.isFriend(this.user)
	}
}
