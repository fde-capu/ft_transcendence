import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UserBookService {
  private login!: string;

  constructor() {
    this.login = document.cookie.split('=')[1];
    if (!this.login) window.location.href = '/';
  }

  getLogin(): string {
    return this.login;
  }
}
