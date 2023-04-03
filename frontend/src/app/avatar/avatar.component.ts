import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnChanges {
  @Input() user!: User;
  popUpOn?: boolean;
  isFriend = false;
  isBlock = false;
  isMe = false;
  amIBlocked?: boolean;
	@Input() dummy?: boolean;

  constructor(
    private router: Router,
		private userService: UserService,
	) {}

  ngOnChanges() {
		if (this.dummy) return;
    this.checkFriendship();
    this.checkBlock();
  }

  checkFriendship() {
    this.isFriend = this.userService.isFriend(this.user);
  }

  checkBlock() {
    this.isBlock = this.userService.isBlock(this.user);
    this.amIBlocked = this.userService.amIBlocked(this.user);
  }

	goToProfile() {
		this.router.navigate(['/profile/' + this.user?.intraId]);
	}
}
