import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError, of } from 'rxjs';

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
	isBlock: boolean = false;
	isMe: boolean = false;
	loggedUser?: User;
	amIBlocked?: boolean;

	constructor(
		private userService: UserService,
	){}

	ngOnChanges() {
		this.checkFriendship();
		this.checkBlock();
		this.checkMe();
//		this.updateMe();
	}

	async updateMe(): Promise<void> {
		//console.log("avatar update");
		await new Promise(resolve => setTimeout(resolve, 1985 + (Math.random() * 6981)));
		if (!this.userService.authorized()) return;
		if (this.user)
		{
			this.userService.getUser(this.user.intraId)
				.pipe(catchError(err=>{
					this.userService.handleError<any>('updateMe');
					return of(err);
				}))
				.subscribe(_=>{
					if (this.displayUser?.name != _?.name)
						this.displayUser = _;
					this.updateMe();
				})
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

	checkBlock() {
		this.isBlock=this.userService.isBlock(this.user)
		this.amIBlocked=this.userService.amIBlocked(this.user);
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
