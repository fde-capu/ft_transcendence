import { Component } from '@angular/core';
import { UserBookService } from '../user-book.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  login!: string;
  constructor(private readonly userBookService: UserBookService) {}

  ngOnInit() {
    this.login = this.userBookService.getLogin();
    fetch('http://localhost:3000/ping', { credentials: 'include' })
      .then(async r => console.log(await r.json()))
      .catch(e => console.error(e));
  }
}
