import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  constructor(
    private userService: UserService,
  ) {}
	@Input() user: User | undefined;
  friends: User[] = [];
  ngOnChanges(): void {this.getFriends();}
  getFriends(): void {
	this.userService.getFriends(this.user).subscribe(_=>{
		console.log("FriendsListComponent got", _);
		this.friends = _;
	});
  }
}
