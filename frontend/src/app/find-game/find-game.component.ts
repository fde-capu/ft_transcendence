import { io } from 'socket.io-client';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-find-game',
  templateUrl: './find-game.component.html',
  styleUrls: ['./find-game.component.css']
})
export class FindGameComponent implements OnInit {
  socket: any;

  constructor(
    private router: Router,
  )
  {}

  ngOnInit() {
    const socketOptions = {
      withCredentials: true
    };
    this.socket = io('ws://localhost:3000/queue', socketOptions);
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });
    this.socket.on('game:room:create', (id: string) => {
      console.log(`Room ${id} created!`);
     
			const link = "/game/" + id;
			this.router.navigate([link]);

    });
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
   
  }
}

