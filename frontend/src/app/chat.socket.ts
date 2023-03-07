import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class ChatSocket extends Socket {
  constructor() {
	console.log("Chat socket constructor");
    super({
      url: 'http://localhost:3000/chat',
      options: { withCredentials: true },
    });
  }
}
