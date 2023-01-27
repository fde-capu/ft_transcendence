import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user-interface';
import { USERS } from './mocks';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getUsers(): Observable<User[]> {
	const users = of(USERS);
	return users;
  }
}
