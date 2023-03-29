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

  ngOnChanges(): void {
    this.getFriends();
  }

  getFriends(): void {
    this.userService.getFriends(this.user).subscribe(friends => {
      this.friends = friends;
    });
  }
}
