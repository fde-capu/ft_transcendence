import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

export interface TokenInfoResponse {
  sub: string;
  exp: number;
  mfa: {
    enabled: boolean;
    verified: boolean;
  };
}

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
}
