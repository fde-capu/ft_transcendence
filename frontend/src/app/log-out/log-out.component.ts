import { Component } from '@angular/core';
import { OnlineSocket } from '../online.socket';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css'],
})
export class LogOutComponent {
  constructor(
    private readonly onlineSocket: OnlineSocket
  ) {}

	ngOnInit() {
    this.onlineSocket.emit('online:bye');
	}
}
