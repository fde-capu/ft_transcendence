import { Injectable } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HelperFunctionsService {
  constructor(private readonly router: Router) {}

  isStringInArray(str: string, array: string[] = []): boolean {
    if (!array || !array.length) return false;
    for (const user of array) if (user == str) return true;
    return false;
  }

  removeStringFromArray(str: string, array: string[]): string[] {
    const out = [];
    for (const t of array) if (t != str) out.push(t);
    return out;
  }

  equalArray(a: string[] | undefined, b: string[] | undefined) {
    if (!b && !a) return true;
    if (!b || !a) return false;
    for (const u of a) if (!this.isStringInArray(u, b)) return false;
    for (const u of b) if (!this.isStringInArray(u, a)) return false;
    return true;
  }

  equalUserArray(u_a: User[] | undefined, u_b: User[] | undefined) {
    if (!u_b && !u_a) return true;
    if (!u_b || !u_a) return false;
    const a: string[] = [];
    const b: string[] = [];
    for (const u of u_a) a.push(u.intraId);
    for (const u of u_b) b.push(u.intraId);
    return this.equalArray(a, b);
  }

  refreshScreen() {
    this.router.navigate([this.router.url]);
  }

  validateString(str: string): boolean {
    return str.length >= 4 && str.length <= 42;
  }

  switchIf(el: string, a: string, b: string) {
    const exist = document.getElementById(el);
    if (!exist) return;
    setTimeout(function () {
      exist.innerHTML = exist.innerHTML == a ? b : a;
    }, 300);
  }
  blur(el: string) {
    const exist = document.getElementById(el);
    if (!exist) return;
    exist.blur();
  }
  blink(el: string) {
    const exist = document.getElementById(el);
    if (!exist) return;
    exist.classList.add('inverted');
    setTimeout(function () {
      exist.classList.remove('inverted');
    }, 200);
  }
  async blink3(el: string) {
    this.blink(el);
    await new Promise(resolve => setTimeout(resolve, 355));
    this.blink(el);
    await new Promise(resolve => setTimeout(resolve, 355));
    this.blink(el);
  }
  focusIf(me: string, cond: string, target: string) {
    const me_exist = document.getElementById(me);
    if (!me_exist) return;
    const target_exist = document.getElementById(target);
    if (!target_exist) return;
    if (me_exist.innerHTML === cond) target_exist.focus();
  }
  switchHTML(el: string, a: string, b: string) {
    const exist = document.getElementById(el);
    if (!exist) return;
    exist.innerHTML = exist.innerHTML == a ? b : a;
  }
  focusOn(el: string): void {
    const exist = document.getElementById(el);
    if (exist) exist.focus();
  }
  focus(el: string): void {
    this.focusOn(el);
  }
  scrollTo(el: string): void {
    const exist = document.getElementById(el);
    if (exist) exist.scrollIntoView();
  }
  randomWord(amount: number): string {
    if (amount <= 0) return '';
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return (
      letters[Math.floor(Math.random() * letters.length)] +
      this.randomWord(--amount)
    );
  }
  funnyName(): string {
    const nouns: string[] = [
      'House',
      'Lair',
      'Universe',
      'Table',
      'The Goal',
      'Tales',
      'Games',
      'Light',
      'Pixels',
      'Pong',
      'Static',
      'Congrats',
      'Talk',
    ];
    const verbs: string[] = [
      'Of',
      'About',
      'In',
      'From',
      'Above',
      'Under',
      'Contrary To',
      'Demonstrating',
      'All Around',
      'Pongs',
      'Spiraling',
      'Striking',
      'On',
    ];
    const adjectives: string[] = [
      'A Fantastic',
      'The Pongster',
      'The Incredible',
      'The Amazing',
      'Some Sort Of',
      'Ultra Fast',
      'Chaos',
      'Pong',
      'Wholesome',
      'Around',
      'Enlightened',
      'Alien',
      'Master',
      'Artificial',
    ];
    const directObjects: string[] = [
      'Dragon',
      'Champion',
      'Ratchet',
      'Ball',
      'Comet',
      'Star',
      'Speed',
      'Life',
      'Pong!',
      'Void',
      '- And Around',
      'Inteligence',
      'Energy',
    ];

    const selectedNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const selectedVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const selectedAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const selectedObject =
      directObjects[Math.floor(Math.random() * directObjects.length)];

    return (
      selectedNoun +
      ' ' +
      selectedVerb +
      ' ' +
      selectedAdjective +
      ' ' +
      selectedObject
    );
  }
  funnyInnocence(): string {
    const phrases: string[] = [
      'Who? Me?',
      "What'd I do?",
      'Really?',
      'What?',
      'Seriously?',
      'Eita!',
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
}
