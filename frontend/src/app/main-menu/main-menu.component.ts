import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
	@Input() big: Boolean = false;
	constructor(
		private readonly authService: AuthService
	) {};
	signOut() {
		this.authService.signOut();
	}
}
