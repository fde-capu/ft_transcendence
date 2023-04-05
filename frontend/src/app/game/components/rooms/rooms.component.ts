import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../entity/room.entity';
import { GameSocket } from '../../socket/rooms.socket';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/user';
import { firstValueFrom, map, tap } from 'rxjs';
import { Dictionary } from '../../entity/game.entity';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: Array<Room> = [];

  errorMessage?: string;
  errorHidden = true;
  users: Dictionary<User> = {};

  constructor(
    private readonly gameSocket: GameSocket,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService
  ) {
    this.gameSocket
      .fromEvent<Array<Room>>('game:room:list')
      .pipe(tap(rs => rs.forEach(r => this.getUser(r.host.id))))
      .subscribe({ next: r => (this.rooms = r) });

    this.gameSocket.fromEvent<string>('game:room:create').subscribe({
      next: id => this.router.navigate([`./${id}`], { relativeTo: this.route }),
    });
  }

  ngOnInit(): void {
    this.gameSocket.emit('game:room:list');

    if (history.state.error) {
      this.errorMessage = history.state.error;
      this.errorHidden = false;

      history.pushState({}, '', this.router.url);
    }
  }

  createRoom() {
    this.gameSocket.emit('game:room:create');
  }

  async getUser(intraId: string): Promise<void> {
    const user = await firstValueFrom(this.userService.getUserById(intraId));
    if (!user) return;
    this.users[user.intraId] = user;
  }
}
