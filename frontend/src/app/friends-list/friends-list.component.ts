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
  ngOnChanges() {
		this.getFriends();
  }
  async getFriends(): Promise<void> {
	if (!this.user) {
		await new Promise(resolve => setTimeout(resolve, 539));
		return await this.getFriends();
	}
	this.userService.getFriends(this.user).subscribe(_=>{
		//console.log("FriendsListComponent got", _);
		this.friends = _;
	});
	await new Promise(resolve => setTimeout(resolve, 5239));
	this.getFriends();
  }
}
