import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../user.service';
import { User } from '../../../user';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RoomSocket } from '../../socket/room.socket';
import { Room } from '../../entity/room.entity';

enum RoomStatus {
  LOADING = 'LOADING',
  WAITING = 'WAITING',
  RUNNING = 'RUNNING',
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  status: RoomStatus = RoomStatus.LOADING;

  readonly availableUsers$: Observable<Array<User>>;

  roomSocket!: RoomSocket;

  room!: Room;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService
  ) {
    this.availableUsers$ = userService.getAvailableUsers();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'none';
    this.roomSocket = new RoomSocket(id);

    this.roomSocket
      .fromEvent<string>('game:room:status')
      .pipe(map(str => JSON.parse(str) as Room))
      .subscribe({
        next: r => {
          this.room = r;
          this.status = r.inGame ? RoomStatus.RUNNING : RoomStatus.WAITING;
        },
      });

    this.roomSocket.emit('game:room:status');
  }
}
