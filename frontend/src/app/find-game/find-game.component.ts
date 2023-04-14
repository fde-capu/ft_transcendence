import { io } from 'socket.io-client';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-game',
  templateUrl: './find-game.component.html',
  styleUrls: ['./find-game.component.css'],
})
export class FindGameComponent implements OnInit, OnDestroy {
  socket: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const socketOptions = {
      withCredentials: true,
    };
    const envBackUrl = environment.BACKEND_ORIGIN;
    this.socket = io(envBackUrl + '/queue', socketOptions);
    this.socket.on('connect', () => {});
    this.socket.emit('join:queue');
    this.socket.on('game:room:create', (id: string) => {
      const link = '/game/' + id;
      this.router.navigate([link]);
    });

    this.socket.on('disconnect', () => {});
  }

  ngOnDestroy() {
    this.socket.emit('leave:queue');
  }
}
