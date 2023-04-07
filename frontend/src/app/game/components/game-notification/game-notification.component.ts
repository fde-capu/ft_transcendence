import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { GameSocket } from '../../socket/rooms.socket';
import { debounce, filter, interval, map, switchMap, tap } from 'rxjs';
import { Room } from '../../entity/room.entity';

@Component({
  selector: 'app-game-notification',
  templateUrl: './game-notification.component.html',
  styleUrls: ['./game-notification.component.css'],
})
export class GameNotificationComponent implements OnInit {
  displayNotification = false;
  roomId?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly gameSocket: GameSocket,
    private readonly router: Router
  ) {}

  ngOnInit() {
    let userId: string;

    this.authService
      .getAuthContext()
      .pipe(
        filter(ctx => !!ctx),
        map(ctx => ctx!.sub),
        tap(sub => (userId = sub)),
        switchMap(() =>
          this.gameSocket.fromEvent<Array<Room>>('game:room:list')
        ),
        map(
          rooms =>
            rooms.find(room =>
              room.teams
                .flatMap(team => team.players)
                .find(player => player.id === userId)
            ) as Room
        ),
        filter(room => !!room),
        debounce(() => interval(1000))
      )
      .subscribe({
        next: room => {
          this.roomId = room.id;
          if (this.router.url !== `/game/${this.roomId}`)
            this.displayNotification = room.inGame;
        },
      });
  }

  redirectToGameRoom(roomId: string) {
    this.displayNotification = false;
    if (this.router.url !== `/game/${roomId}`)
      this.router.navigate(['game', roomId]);
  }
}
