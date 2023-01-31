import { Component } from '@angular/core';
import { User } from '../user-interface';
import { UserService } from '../user.service';
import { USERS } from '../mocks';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	user: User = {} as User;
	constructor(private userService: UserService) {};
	// TODO get user value from URI *or* if URI is empty, user is logged user.
	ngOnInit(): void {
		this.getUserFromURI();
	}
	getUserFromURI(): void {
		// "getUserFromURI" is here only for testing.
		this.userService.getUserFromURI()
			.subscribe(userFromURI => this.user = userFromURI);
	}
	focusOn(el: string): void {
		const exist = document.getElementById(el);
		if (exist) exist.focus();
	};
	focusIf(me: string, cond: string, target: string)
	{
		const me_exist = document.getElementById(me);
		if (!me_exist) return ;
		const target_exist = document.getElementById(target);
		if (!target_exist) return ;
		if (me_exist.innerHTML === cond)
			target_exist.focus();
	};
	switchHTML(el: string, a: string, b: string) {
		const exist = document.getElementById(el);
		if (!exist) return ;
		exist.innerHTML = exist.innerHTML == a ? b : a;
	}
	switchIf(el: string, a: string, b: string) {
		const exist = document.getElementById(el);
		if (!exist) return ;
		let n: ReturnType<typeof setTimeout>;
		n = setTimeout(function() {
				exist.innerHTML = exist.innerHTML == a ? b : a;
				}, 300);
	};
	blur(el: string)
	{
		const exist = document.getElementById(el);
		if (!exist) return ;
		exist.blur();
	}
	blink(el: string)
	{
		const exist = document.getElementById(el);
		if (!exist) return ;
		exist.classList.add('inverted');
		let n: ReturnType<typeof setTimeout>;
		n = setTimeout(function() {
				exist.classList.remove('inverted');
				}, 200);
	}
}
