import { Component } from '@angular/core';
import { UserService } from '../../../user.service';
import { User } from '../../../user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent {
  readonly availableUsers$: Observable<Array<User>>;

  inGame = true;

  constructor(userService: UserService) {
    this.availableUsers$ = userService.getAvailableUsers();
  }
}
