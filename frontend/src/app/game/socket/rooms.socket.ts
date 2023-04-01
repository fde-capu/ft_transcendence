import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameSocket extends Socket {
  constructor() {
    super({
      url: `${environment.backendOrigin}/game`,
      options: { withCredentials: true },
    });
  }
}
