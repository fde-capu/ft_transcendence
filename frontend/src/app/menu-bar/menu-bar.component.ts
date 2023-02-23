import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  user?: User;
  menuOpen = false;

  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    this.userService.getLoggedUser().subscribe(user => {
		this.user = user;
	});
  }

  onClickBurger(): void {
    this.menuOpen = !this.menuOpen;
  }
  menuOff(): void {
    this.menuOpen = false;
  }
  signOut() {
    this.authService.signOut();
  }
}
