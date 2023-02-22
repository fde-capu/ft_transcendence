import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class GameSocket extends Socket {
  constructor() {
    super({
      url: 'http://localhost:3000/game',
      options: { withCredentials: true },
    });
  }
}
