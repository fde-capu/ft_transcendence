import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatSocket extends Socket {
  constructor() {
    super({
      url: `${environment.backendOrigin}/chat`,
      options: { withCredentials: true },
    });
  }
}
