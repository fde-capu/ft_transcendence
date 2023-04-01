import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class InviteSocket extends Socket {
  constructor() {
	//console.log("Invite socket constructor");
    super({
      url: `${environment.backendOrigin}/invite`,
      options: { withCredentials: true },
    });
  }
}
