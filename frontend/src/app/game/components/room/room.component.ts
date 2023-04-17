import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Room } from '../../entity/room.entity';
import { RoomSocket } from '../../socket/room.socket';
import { NotificationService } from 'src/app/notification/service/notification.service';
import { GameData, Dictionary } from '../../entity/game.entity';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  userId!: string;

  room!: Room;

  roomSocket!: RoomSocket;

  scene: string = 'off';
  alternateReady: boolean = false;
  paused: boolean = false;
  score: Dictionary<number> = {};
  leftWin: boolean = false;
  rightWin: boolean = false;
  topWin: boolean = false;
  bottomWin: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {
    this.authService
      .getAuthContext()
      .subscribe({ next: ctx => (this.userId = ctx!.sub) });
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

    this.roomSocket.fromEvent<Room>('game:room:status').subscribe(async res => {
      this.room = res;
      this.alternateReady = this.thePlayer(this.userId)?.ready;
      this.notificationService.setNonDisturbMode(res.inGame);
      this.pauseCheck();
      this.cutScene();
    });

    this.roomSocket.emit('game:room:status');

    this.roomSocket.fromEvent<GameData>('game:status').subscribe({
      next: status => {
        this.score = status.teams;
      },
    });
  }

  amIAudience() {
    for (const aud of this.room.audience)
      if (aud.id == this.userId) return true;
    return false;
  }

  pauseCheck() {
    if (
      (this.room && this.room.inGame && this.room.running) ||
      (this.scene == 'off' &&
        this.room &&
        this.room.inGame &&
        !this.room.running &&
        this.amIAudience())
    )
      this.scene = 'game';
    this.paused =
      this.scene == 'game' &&
      this.room &&
      this.room.inGame &&
      !this.room.running;
  }

  ngOnDestroy() {
    this.roomSocket?.disconnect();
  }

  isPlayer(): boolean {
    return !!this.room.teams
      .flatMap(t => t.players)
      .find(p => p.id === this.userId);
  }

  thePlayer(intraId: string): any {
    return this.room.teams.flatMap(t => t.players).find(p => p.id === intraId);
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

  allIn(): boolean {
    let ready_c: number = 0;
    let total_c: number = -1;
    if (this.room.mode == 0) {
      total_c = 2;
      ready_c += this.room.teams[0].players[0]?.ready ? 1 : 0;
      ready_c += this.room.teams[1].players[0]?.ready ? 1 : 0;
    } else if (this.room.mode == 1) {
      total_c = 4;
      ready_c += this.room.teams[0].players[0]?.ready ? 1 : 0;
      ready_c += this.room.teams[0].players[1]?.ready ? 1 : 0;
      ready_c += this.room.teams[1].players[0]?.ready ? 1 : 0;
      ready_c += this.room.teams[1].players[1]?.ready ? 1 : 0;
    } else if (this.room.mode == 2) {
      total_c = 4;
      ready_c += this.room.teams[0].players[0]?.ready ? 1 : 0;
      ready_c += this.room.teams[1].players[0]?.ready ? 1 : 0;
      ready_c += this.room.teams[2].players[0]?.ready ? 1 : 0;
      ready_c += this.room.teams[3].players[0]?.ready ? 1 : 0;
    }
    return ready_c == total_c;
  }

  async cutScene(): Promise<void> {
    let allPlayers = this.allIn();
		if (allPlayers) this.alternateReady = false;
    let prevScene = this.scene;
    let newScene =
      this.scene == 'off' && allPlayers
        ? 'intro'
        : this.scene == 'game' && !this.room.inGame && allPlayers
        ? 'outro'
        : this.scene == 'game' && !this.room.inGame && !allPlayers
        ? 'justFlash'
        : this.scene;
    if (prevScene == 'game' && newScene == 'outro') {
      if (this.room.mode == 0 || this.room.mode == 1) {
        this.leftWin = this.score['LEFT'] > this.score['RIGHT'];
        this.rightWin = this.score['RIGHT'] > this.score['LEFT'];
      } else if (this.room.mode == 2) {
        this.leftWin =
          this.score['LEFT'] > this.score['RIGHT'] &&
          this.score['LEFT'] > this.score['TOP'] &&
          this.score['LEFT'] > this.score['BOTTOM'];
        this.rightWin =
          this.score['RIGHT'] > this.score['LEFT'] &&
          this.score['RIGHT'] > this.score['TOP'] &&
          this.score['RIGHT'] > this.score['BOTTOM'];
        this.topWin =
          this.score['TOP'] > this.score['RIGHT'] &&
          this.score['TOP'] > this.score['LEFT'] &&
          this.score['TOP'] > this.score['BOTTOM'];
        this.bottomWin =
          this.score['BOTTOM'] > this.score['RIGHT'] &&
          this.score['BOTTOM'] > this.score['TOP'] &&
          this.score['BOTTOM'] > this.score['LEFT'];
      }
    }
    this.scene = newScene;

    if (this.scene == 'off' || this.scene == 'game') return;

    await new Promise(resolve => setTimeout(resolve, 3000));

    this.scene = this.scene == 'intro' || this.scene == 'game' ? 'game' : 'off';
  }
}
