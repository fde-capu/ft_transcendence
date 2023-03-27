import { Injectable } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {

  constructor(
		private readonly router: Router,
  ) { }

	isStringInArray(str: string, array: string[] = []): boolean {
		if (!array || !array.length) return false;
		for (const user of array)
			if (user == str)
				return true;
		return false;
	}

	removeStringFromArray(str: string, array: string[]): string[] {
		let out = [];
		for (const t of array)
			if (t != str)
				out.push(t);
		return out;
	}

	refreshScreen() {
		this.router.navigate([this.router.url]);
	}

	validateString(str:string): boolean {
		return str.length >= 4 && str.length <= 42;
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
	async blink3(el: string)
	{
		this.blink(el);
		await new Promise(resolve => setTimeout(resolve, 255));
		this.blink(el);
		await new Promise(resolve => setTimeout(resolve, 255));
		this.blink(el);
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
	scrollTo(el: string): void {
		const exist = document.getElementById(el);
		if (exist) exist.scrollIntoView();
	}
	randomWord(amount: number): string {
		if (amount <= 0) return "";
		const letters = "abcdefghijklmnopqrstuvwxyz";
		return letters[
			Math.floor(Math.random() * letters.length)
		] + this.randomWord(--amount);
	}
	funnyName(): string {
		let noun: number = Math.random();
		let verb: number = Math.random();
		let adjective: number = Math.random();
		let directObject: number = Math.random();
		
		let nouns: string[] = ["House", "Lair", "Universe", "Table", "The Goal",
			"Tales", "Games", "Light", "Pixels", "Pong", "Static", "Congrats",
			"Talk"
			];
		let verbs: string[] = ["Of", "About", "In", "From", "Above", "Under",
			"Contrary To", "Demonstrating", "All Around", "Pongs", "Spiraling",
			"Striking", "On",
			];
		let adjectives: string[] = ["A Fantastic", "The Pongster",
			"The Incredible", "The Amazing", "Some Sort Of", "Ultra Fast",
			"Chaos", "Pong", "Wholesome", "Around", "Enlightened", "Alien", "Master",
			"Artificial"];
		let directObjects: string[] = ["Dragon", "Champion", "Ratchet", "Ball",
			"Comet", "Star", "Speed", "Life", "Pong!", "Void", "- And Around",
			"Inteligence", "Energy",
			];

		let selectedNoun = nouns[Math.floor(Math.random()*nouns.length)];
		let selectedVerb = verbs[Math.floor(Math.random()*verbs.length)];
		let selectedAdjective = adjectives[Math.floor(Math.random()*adjectives.length)];
		let selectedObject = directObjects[Math.floor(Math.random()*directObjects.length)];

		return selectedNoun + " " + selectedVerb + " " + selectedAdjective + " " + selectedObject
	}
	funnyInnocence(): string {
		let phrases: string[] = [ "Who? Me?", "What'd I do?", "Really?", "What?", "Seriously?", "Eita!"];
		return phrases[Math.floor(Math.random()*phrases.length)];
	}
}
