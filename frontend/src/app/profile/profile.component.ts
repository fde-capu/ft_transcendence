import { Component } from '@angular/core';
import { User } from '../user-interface';
import { USERS } from '../mocks';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	user: User = {
		intraId: "ftt_undef_intraId",
		name: "ftt_undef_name",
		image: "ftt_undef_image"
	};
}
