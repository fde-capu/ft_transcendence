import { Component } from '@angular/core';
import { User } from '../user-interface';
import { USERS } from '../mocks';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	user: User = {} as User;
	owner: Boolean = false;

	constructor (
		private userService: UserService,
		private route: ActivatedRoute,
		private location: Location
	) {};

	ngOnInit(): void {
		this.getUser();
	}
	getUser(): void {
		const id = this.route.snapshot.paramMap.get('intraId');
		if (id !== null) {
			this.userService.getUserById(id)
				.subscribe(user => this.user = user);
		}
		else
		{
			this.userService.getLoggedUser()
				.subscribe(user => this.user = user);
			this.owner = true;
		}
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
