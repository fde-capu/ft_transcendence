import { Component, Input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css']
})
export class UserBarComponent {
	@Input() user?: User;
}
