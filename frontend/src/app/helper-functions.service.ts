import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperFunctionsService {
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
}
