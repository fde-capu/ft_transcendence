import { Component } from '@angular/core';
import { User } from '../user-interface';
import { USERS } from '../mocks';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent {
	user: User = {
		intraId: "ftt_undef_intraId",
		name: "ftt_undef_name",
		image: "ftt_undef_image"
	};
}
