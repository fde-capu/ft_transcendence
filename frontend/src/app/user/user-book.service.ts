import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UserBookService {
  private access_token!: string;

  constructor() {
    this.access_token = document.cookie.split('=')[1];
    if (!this.access_token) window.location.href = '/';
  }

  getAccessToken(): string {
    return this.access_token;
  }
}
