import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent implements OnInit {
  user?: User;
  menuOpen = false;
	waiting: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUser();
  }

  async getUser(): Promise<void> {
    this.user = UserService.currentUser;
		this.waiting = !!!this.user;
    await new Promise(resolve => setTimeout(resolve, 143));
    this.getUser();
  }
	// ^ The "waiting" screen will be up until
	//	 menu-bar knows the current User.

  onClickBurger(): void {
    this.menuOpen = !this.menuOpen;
  }

  menuOff(): void {
    this.menuOpen = false;
  }
}
