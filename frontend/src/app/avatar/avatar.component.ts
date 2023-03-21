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
	displayUser?: User;
	popUpOn = false;
	isFriend: boolean = false;
	isMe: boolean = false;
	loggedUser?: User;

	constructor(
		private userService: UserService,
	){}

	ngOnChanges() {
		this.checkFriendship();
		this.checkMe();
		this.updateMe();
	}

	async updateMe() {
		if (!this.user)
		{
			await new Promise(resolve => setTimeout(resolve, 647));
			await this.updateMe();
		}
		else // Because no `return` above, so have to trick TS.
		{
			this.userService.getUser(this.user.intraId).subscribe(_=>{
				if (this.displayUser?.name != _?.name)
					this.displayUser = _;
			});
			// Lazy update, because there are many instances of avatars.
			// Note: chat messages do not update retroactively, but take changes from point on.
			await new Promise(resolve => setTimeout(resolve, 7985 + (Math.random() * 6981)));
			await this.updateMe();
		}
	}

	checkMe() {
		this.userService.getLoggedUser().subscribe(_=>{
			this.loggedUser = _;
			this.isMe = _.intraId == this.user?.intraId;
		});
	}

	checkFriendship() {
		this.isFriend=this.userService.isFriend(this.user)
	}

	onClick(): void {
		this.popUpOn = !this.popUpOn;
	}

	async onHover() {
		this.popUpOn = true;
	}

	onHoverOut(): void {
		this.popUpOn = false;
	}
}
