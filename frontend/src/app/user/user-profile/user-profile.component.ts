import { Component } from '@angular/core';
import { UserBookService } from '../user-book.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  access_token!: string;
  login!: string;
  fullName!: string;
  avatarLink!: string;
  email!: string;

  constructor( 
	private readonly userBookService: UserBookService) {}

  ngOnInit() {
    this.access_token = this.userBookService.getAccessToken();
    fetch (
	  'http://localhost:3000/ping', { credentials: 'include' }
	)
	.then(async r => {
		const statusCode = await r.status;
		console.log(await r.json())
		if (statusCode != 200)
			throw ("From API42, expected 200, got " + statusCode);
		this.login = this.userBookService.getLogin();
		this.fullName = this.userBookService.getName();
		this.avatarLink = this.userBookService.getAvatar();
		this.email = this.userBookService.getEMail();
	})
	.catch(e => console.error(e));
  }
}
