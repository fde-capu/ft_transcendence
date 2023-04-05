import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
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

	scene: string = 'off';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
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

    this.roomSocket
      .fromEvent<Room>('game:room:status')
      .subscribe(async res => {
				this.cutScene(res);
			});

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
		console.log(">>", this.room);
    this.roomSocket.emit('game:room:mode', parseInt(mode));
  }

  ready() {
    this.roomSocket.emit('game:player:ready');
  }

  leave() {
    this.roomSocket.emit('game:room:leave');
  }

	allIn(room: Room): boolean {
		let ready_c: number = 0;
		let total_c: number = -1;
		if (room.mode == 0) {
			total_c = 2;
			ready_c += room.teams[0].players[0]?.ready ? 1 : 0;
			ready_c += room.teams[1].players[0]?.ready ? 1 : 0;
		} else if (room.mode == 1) {
			total_c = 4;
			ready_c += room.teams[0].players[0]?.ready ? 1 : 0;
			ready_c += room.teams[0].players[1]?.ready ? 1 : 0;
			ready_c += room.teams[1].players[0]?.ready ? 1 : 0;
			ready_c += room.teams[1].players[1]?.ready ? 1 : 0;
		} else if (room.mode == 2) {
			total_c = 4;
			ready_c += room.teams[0].players[0]?.ready ? 1 : 0;
			ready_c += room.teams[1].players[0]?.ready ? 1 : 0;
			ready_c += room.teams[2].players[0]?.ready ? 1 : 0;
			ready_c += room.teams[3].players[0]?.ready ? 1 : 0;
		};
		console.log("Ready x/x", ready_c, "/", total_c, this.scene, room.inGame);
		return ready_c == total_c;
	}

	async cutScene(res: Room): Promise<void> {
		let allPlayers = this.allIn(res);

		this.scene = this.scene == 'off' && allPlayers ? 'intro' :
			this.scene == 'game' && !res.inGame ? 'outro' : this.scene;

		if (this.scene == 'off' || this.scene == 'game') {
			this.room = res;
			return ;
		}

    await new Promise(resolve => setTimeout(resolve, 3000));

		this.scene = this.scene == 'intro' || this.scene == 'game' ? 'game' : 'off';
		this.room = res;
	}
}
