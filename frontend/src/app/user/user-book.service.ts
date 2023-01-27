import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class UserBookService {
  private access_token!: string;
  private login!: string;
  private fullName!: string;
  private email!: string;
  private avatarLink!: string;

  constructor() {
	const cookieSplit = document.cookie.split(';');
	this.access_token = cookieSplit[0].split('=')[1];
    if (!this.access_token) window.location.href = '/';
	this.login = cookieSplit[1].split('=')[1];
	this.fullName = "";
	this.email = "";
	this.avatarLink = "";
  }

  getAccessToken(): string {
    return this.access_token;
  }

  getLogin(): string {
	return this.login;
  }

  getName(): string {
	return this.fullName;
  }

  getEMail(): string {
	return this.email;
  }

  getAvatar(): string {
	return this.avatarLink;
  }
}
