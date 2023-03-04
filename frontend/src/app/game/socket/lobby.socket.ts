import { Socket } from 'ngx-socket-io';

export class LobbySocket extends Socket {
  constructor() {
    super({
      url: `http://localhost:3000/room`,
      options: { withCredentials: true },
    });
  }
}
