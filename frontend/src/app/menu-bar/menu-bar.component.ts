import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

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
  async getUser() {
	this.userService.getLoggedUser().subscribe(
		backUser => { 
			//console.log("menu-bar got subscrition", backUser);
			this.user = backUser;
		}
	)
	await new Promise(resolve => setTimeout(resolve, 1007));
	this.getUser();
  }

  onClickBurger(): void {
    this.menuOpen = !this.menuOpen;
  }
  menuOff(): void {
    this.menuOpen = false;
  }
}
