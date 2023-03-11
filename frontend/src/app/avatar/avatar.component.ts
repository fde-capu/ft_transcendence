import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnChanges {
  @Input() user?: User;
  popUpOn = false;
  isFriend = false;
  isMe = false;

  constructor(private userService: UserService) {}

  checkMe() {
    this.userService.getLoggedUser().subscribe(_ => {
      this.isMe = _.intraId == this.user?.intraId;
    });
  }

  ngOnChanges() {
    this.checkFriendship();
    this.checkMe();
  }

  checkFriendship() {
    this.isFriend = this.userService.isFriend(this.user);
  }

  onClick(): void {
    this.popUpOn = this.popUpOn ? false : true;
  }

  onHover(): void {
    this.popUpOn = true;
    this.repeat();
  }

  private repeat() {
    setTimeout(() => {
      return this.popUpOn ? this.repeat() : false;
    }, 300);
  }

  onHoverOut(): void {
    this.popUpOn = false;
  }
}
