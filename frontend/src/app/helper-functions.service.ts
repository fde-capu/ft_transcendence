import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {

  constructor() { }

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
	focusOn(el: string): void {
		const exist = document.getElementById(el);
		if (exist) exist.focus();
	};
	focus(el: string): void {
		this.focusOn(el);
	}
	randomWord(amount: number): string {
		if (amount <= 0) return "";
		const letters = "abcdefghijklmnopqrstuvwxyz";
		return letters[
			Math.floor(Math.random() * letters.length)
		] + this.randomWord(--amount);
	}
}
