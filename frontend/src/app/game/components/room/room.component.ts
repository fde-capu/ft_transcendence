import { Component } from '@angular/core';
import { UserService } from '../../../user.service';
import { User } from '../../../user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent {
	availableUsers: User[] = [];
	constructor(private userService: UserService) {};
	ngOnInit() { this.getAvailableUsers(); }
	getAvailableUsers() {
		this.userService.getAvailableUsers()
			.subscribe(users => this.availableUsers = users);
	}
	doInvitation(){
	};
}
