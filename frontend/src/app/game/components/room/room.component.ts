import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../user.service';
import { User } from '../../../user';
import { map, Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../entity/room.entity';
import { GameSocket } from '../../socket/game.socket';

enum RoomStatus {
  LOADING = 'LOADING',
  WAITING = 'WAITING',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR',
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  status: RoomStatus = RoomStatus.LOADING;

  readonly availableUsers$: Observable<Array<User>>;

  room: Observable<Room>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly gameSocket: GameSocket
  ) {
    this.availableUsers$ = userService.getAvailableUsers();

    this.room = this.gameSocket
      .fromEvent<string>('game:room:status')
      .pipe(map(str => JSON.parse(str) as Room));

    this.gameSocket
      .fromEvent<string>('game:room:status')
      .pipe(map(str => JSON.parse(str) as Room))
      .subscribe({ next: r => console.log(`cade essa poha?`) });

    this.gameSocket.fromEvent('game:room:error').subscribe({
      next: () => this.router.navigate(['./..'], { relativeTo: this.route }),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'none';
    this.gameSocket.emit('game:room:join', id);
  }

  ngOnDestroy(): void {
    //this.gameSocket.emit('game:room:disconnect');
  }
}
