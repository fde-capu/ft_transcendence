import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class InviteSocket extends Socket {
  constructor() {
	//console.log("Invite socket constructor");
    super({
      url: 'http://localhost:3000/invite',
      options: { withCredentials: true },
    });
  }
}
