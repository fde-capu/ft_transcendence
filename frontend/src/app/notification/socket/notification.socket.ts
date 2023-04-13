import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationSocket extends Socket {
  constructor() {
    super({
      url: `${environment.BACKEND_ORIGIN}/notification`,
      options: { withCredentials: true },
    });
  }
}
