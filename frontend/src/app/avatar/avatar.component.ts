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
	@Input() positionbottom?: boolean;

	constructor(
		private userService: UserService,
	){}

	ngOnChanges() {
		this.checkFriendship();
		this.checkBlock();
		this.checkMe();
		this.getDisplayUserOnce();
	}

	async getDisplayUserOnce(): Promise<void> {
		//console.log("avatar update");
		if (!this.userService.authorized() || !this.user) {
			await new Promise(resolve => setTimeout(resolve, 111 + (Math.random() * 981)));
			return this.getDisplayUserOnce();
		}
		this.userService.getUser(this.user.intraId)
			.pipe(catchError(err=>{
				this.userService.handleError<any>('updateMe');
				return of(err);
			}))
			.subscribe(_=>{
				if (this.displayUser?.name != _?.name)
					this.displayUser = _;
			})
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
