import { Component, Input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {
	@Input() user: User = {} as User;
	@Input() big: Boolean = false;
}
