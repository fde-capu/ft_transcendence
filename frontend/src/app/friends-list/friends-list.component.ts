import { Component } from '@angular/core';
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
  user?: User;
  friends: User[] = [];
  ngOnInit(): void {
	this.getUser();
  }
  getUser(): void {
	this.userService.getLoggedUser().subscribe(
		backUser => { 
			//console.log("friends-list got subscrition", backUser);
			this.user = backUser;
			this.getFriends();
		}
	)
  }
  getFriends(): void {
	this.userService.getFriends(this.user).subscribe(
		b_friends => this.friends = b_friends
	);
  }
}
