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
	funnyName(): string {
		let noun: number = Math.random();
		let verb: number = Math.random();
		let adjective: number = Math.random();
		let directObject: number = Math.random();
		
		let nouns: string[] = ["House", "Lair", "Place", "Table", "Goal", "Tales", "Games", "Light", "Pixels", "Pong"];
		let verbs: string[] = ["Of", "About", "In", "From", "Above", "Under", "Contrary to", "Demonstrating", "All Around", "Pong"];
		let adjectives: string[] = ["the Red", "a Pongster", "an Incredible", "an Amazing", "Some Sort of", "an Ultra Fast", "the Chaos", "a Pong"];
		let directObjects: string[] = ["Dragon", "Champion", "Rachet", "Ball", "Comet", "Star", "Speed", "Life", "Pong!"];

		let selectedNoun = nouns[Math.floor(Math.random()*nouns.length)];
		let selectedVerb = verbs[Math.floor(Math.random()*verbs.length)];
		let selectedAdjective = adjectives[Math.floor(Math.random()*adjectives.length)];
		let selectedObject = directObjects[Math.floor(Math.random()*directObjects.length)];

		return selectedNoun + " " + selectedVerb + " " + selectedAdjective + " " + selectedObject
	}
}
