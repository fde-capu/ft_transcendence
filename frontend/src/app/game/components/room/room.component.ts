import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './../../../user';
import { UserService } from 'src/app/user.service';
import { Room } from '../../entity/room.entity';
import { RoomSocket } from '../../socket/room.socket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  userId!: string;

  room!: Room;

  roomSocket!: RoomSocket;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.userService
      .getLoggedUser()
      .subscribe({ next: u => (this.userId = u.intraId) });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 'none';
    this.roomSocket = new RoomSocket(id);

    this.roomSocket.fromEvent('game:room:leave').subscribe({
      next: () =>
        this.router.navigate(['./..'], {
          relativeTo: this.route,
        }),
    });

    this.roomSocket.fromEvent<string>('game:error').subscribe({
      next: str =>
        this.router.navigate(['./..'], {
          relativeTo: this.route,
          state: { error: str },
        }),
    });

    this.roomSocket
      .fromEvent<Room>('game:room:status')
      .subscribe({ next: r => (this.room = r) });

    this.roomSocket.emit('game:room:status');
  }

  ngOnDestroy() {
    this.roomSocket?.disconnect();
  }

  isPlayer(): boolean {
    return !!this.room.teams
      .flatMap(t => t.players)
      .find(p => p.id === this.userId);
  }

  seMode(mode: string) {
    this.roomSocket.emit('game:room:mode', parseInt(mode));
  }

  ready() {
    this.roomSocket.emit('game:player:ready');
  }

  leave() {
    this.roomSocket.emit('game:room:leave');
  }
}
