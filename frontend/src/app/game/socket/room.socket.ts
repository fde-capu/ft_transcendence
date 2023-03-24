import { Socket } from 'ngx-socket-io';

export class RoomSocket extends Socket {
  constructor(roomId: string) {
    super({
      url: `http://localhost:3000/game/${roomId}`,
      options: { withCredentials: true },
    });
  }
}
