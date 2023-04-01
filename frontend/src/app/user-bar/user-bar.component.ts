import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css'],
})
export class UserBarComponent implements OnChanges {
  @Input() user?: User;
  isFriend = false;
  isBlock = false;
  amIBlocked = false;

  constructor(private userService: UserService) {}

  ngOnChanges() {
    this.checkFriendship();
    this.checkBlocks();
  }

  checkFriendship() {
    this.isFriend = this.userService.isFriend(this.user);
  }

  checkBlocks() {
    this.isBlock = this.userService.isBlock(this.user);
    this.amIBlocked = this.userService.amIBlocked(this.user);
  }
}
