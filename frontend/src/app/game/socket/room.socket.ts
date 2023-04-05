import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

export class RoomSocket extends Socket {
  constructor(roomId: string) {
    super({
      url: `${environment.backendOrigin}/rooms/${roomId}`,
      options: { withCredentials: true },
    });
  }
}
