import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent {
  constructor(
    private userService: UserService,
  ) {}

  user?: User;
  menuOpen = false;

  ngOnInit(): void {
	this.getUser();
  }
  async getUser(): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, 1007));
	if (!this.userService.authorized() || !UserService.currentUser)
		return this.getUser();
	this.user = UserService.currentUser;
	this.getUser();
  }

  onClickBurger(): void {
    this.menuOpen = !this.menuOpen;
  }
  menuOff(): void {
    this.menuOpen = false;
  }
}
