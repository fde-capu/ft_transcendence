import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-u2u-actions',
  templateUrl: './u2u-actions.component.html',
  styleUrls: ['./u2u-actions.component.css']
})
export class U2uActionsComponent {
	@Input() isFriend?: boolean;
	@Input() user?: User;
	@Input() caption?: boolean;

	constructor(
		private userService: UserService
	){}

	makeFriend(){
		this.userService.makeFriend(this.user).subscribe();
	}

	unFriend(){
		this.userService.unFriend(this.user).subscribe();
	}
}
