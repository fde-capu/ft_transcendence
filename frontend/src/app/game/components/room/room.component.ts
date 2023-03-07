import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs';
import { Room } from '../../room.entity';
import { RoomSocket } from '../../socket/room.socket';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent {
  roomSocket: Socket;

  room?: Room;

  constructor(private readonly route: ActivatedRoute) {
    const roomId = this.route.snapshot.paramMap.get('id');
    if (!roomId) throw new Error('foobar');
    this.roomSocket = new RoomSocket(roomId);
    this.roomSocket
      .fromEvent<Room>('game:room:info')
      .pipe(tap(r => console.dir(r)))
      .subscribe({ next: r => (this.room = r) });
  }
}
