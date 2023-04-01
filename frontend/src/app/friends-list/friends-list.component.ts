import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
})
export class FriendsListComponent implements OnChanges {
  @Input() user?: User;
  friends: User[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges() {
    this.getFriends();
  }
  async getFriends(): Promise<void> {
    if (!this.user) {
      await new Promise(resolve => setTimeout(resolve, 539));
      return await this.getFriends();
    }
    this.userService.getFriends(this.user).subscribe(_ => {
      this.friends = _;
    });
    await new Promise(resolve => setTimeout(resolve, 5239));
    this.getFriends();
  }
}
