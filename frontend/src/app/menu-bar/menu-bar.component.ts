import { Component } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError } from 'rxjs/operators';

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
	if (!this.userService.authorized()) return;
	this.userService.getLoggedUser()
	.pipe(catchError(this.userService.handleError<any>()))
	.subscribe(
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
