import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
selector: 'app-avatar',
templateUrl: './avatar.component.html',
styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
	@Input() user?: User;
	popUpOn = false;
	isFriend: boolean = false;

	constructor(
		private userService: UserService
	){}

	ngOnChanges() {
		this.checkFriendship();
	}

	checkFriendship() {
		this.userService.isFriend(this.user).subscribe(_=>{
			this.isFriend=_;
			console.log(this.user?.intraId, "checks friendship to you:", _);
		});
	}

	onClick(): void {
		this.popUpOn = this.popUpOn ? false : true;
	}

	onHover(): void {
		const self = this;
		this.popUpOn = true;
		function repeat(){
			setTimeout(function() {
				return self.popUpOn ? repeat() : false;
			}, 300);
		}; repeat();
	}

	onHoverOut(): void {
		this.popUpOn = false;
	}
}
