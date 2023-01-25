import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from './user.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  getCurrentUser(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>('http://localhost:3000/user/me', {
      withCredentials: true,
    });
  }
}
