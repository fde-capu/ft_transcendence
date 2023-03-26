import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private readonly route: ActivatedRoute) {
    /*this.gameSocket.fromEvent('game:room:error').subscribe({
      next: () => this.router.navigate(['./..'], { relativeTo: this.route }),
    });*/
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || 'none';
    this.roomSocket = new RoomSocket(id);

    this.roomSocket
      .fromEvent<string>('game:logs')
      .subscribe({ next: str => console.log(str) });

    this.roomSocket
      .fromEvent<string>('game:error')
      .subscribe({ next: str => console.error(str) });

    this.roomSocket
      .fromEvent<Room>('game:room:status')
      .pipe(tap(r => console.log(r)))
      .subscribe({ next: r => (this.room = r) });

    this.roomSocket.emit('game:room:status');
  }

  ngOnDestroy(): void {
    this.roomSocket?.disconnect();
  }
}
