import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Room } from '../../entity/room.entity';
import { RoomSocket } from '../../socket/room.socket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  room!: Room;

  roomSocket!: RoomSocket;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 'none';
    this.roomSocket = new RoomSocket(id);

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
