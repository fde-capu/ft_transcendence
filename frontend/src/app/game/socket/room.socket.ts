import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

export class RoomSocket extends Socket {
  constructor(roomId: string) {
    super({
      url: `${environment.BACKEND_ORIGIN}/rooms/${roomId}`,
      options: { withCredentials: true },
    });
  }
}
