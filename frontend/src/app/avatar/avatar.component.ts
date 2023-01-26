import { Component, Input } from '@angular/core';
import { User } from '../user-interface';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {

	@Input() user?: User;


//	user: User = {
//		intraId: "ftt_undef_intraId",
//		name: "ftt_undef_name",
//		image: "ftt_undef_image"
//	};
	onClick(): void {
		// TODO open interaction mini-popup.
	}
}
