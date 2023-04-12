import { Component, OnInit } from '@angular/core';
import { Room } from '../../entity/room.entity';
import { RoomsService }  from './rooms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent {
  rooms: Array<Room> = [];
  roomLink: string = "";
  invitationMode: Boolean = false;
  errorMessage?: string;
  errorHidden = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
		private readonly roomsService: RoomsService,
  ) {
		this.roomsService.rooms.subscribe(_=>{this.rooms=_});
	}

  createRoom() {
		this.roomsService.createRoom();
  }

  findGame() {
		this.router.navigate(['/findgame']);
  }

  async getLastLink(): Promise<string> {
		return this.roomsService.getLastLink();
	}
}
