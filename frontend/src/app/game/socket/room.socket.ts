import { Socket } from 'ngx-socket-io';

export class RoomSocket extends Socket {
  constructor(roomId: string) {
    super({
      url: `http://localhost:3000/rooms/${roomId}`,
      options: { withCredentials: true },
    });
  }
}
