import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { OnlineSocket } from '../online.socket';
import { forkJoin, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css'],
})
export class OnlineUsersComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private readonly onlineSocket: OnlineSocket
  ) {}

  ngOnInit(): void {
    this.onlineSocket
      .fromEvent<Array<string>>('online:list')
      .pipe(
        switchMap(users =>
          forkJoin(users.map(user => this.userService.getSingleUser(user)))
        )
      )
      .subscribe({ next: users => (this.users = users) });

    this.onlineSocket.emit('online:list');
  }
}
