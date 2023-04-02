import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../entity/room.entity';
import { GameSocket } from '../../socket/rooms.socket';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: Array<Room> = [];
  roomLink: string = "";
  invitationMode: Boolean = false;
  errorMessage?: string;
  errorHidden = true;
  once?: boolean;

  constructor(
    private readonly gameSocket: GameSocket,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {

    this.gameSocket
      .fromEvent<Array<Room>>('game:room:list')
      .subscribe({ next: r => (this.rooms = r) });

    this.gameSocket.fromEvent<string>('game:room:create').subscribe({
      next: id => {
		this.roomLink = "/game/" + id;
		if (!this.invitationMode)
			this.router.navigate([this.roomLink]);
    }});
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
	this.roomLink = "";
    this.gameSocket.emit('game:room:create');
  }

  async getLastLink(): Promise<string> {
	this.invitationMode = true;
	if (!this.once) {
		this.createRoom();
		this.once = true;
	}
	if (this.roomLink === "") {
		await new Promise(resolve => setTimeout(resolve, 263));
		return this.getLastLink();
	}
	this.once = false;
	return this.roomLink;
  }
}
