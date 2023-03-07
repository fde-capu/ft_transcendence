import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { TokenService } from 'src/auth/service/token.service';

export interface Invitation {
	from: string;
	to: string;
	type: string;
	route: string;
	answer?: boolean;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
  cookie: true,
  namespace: 'invite',
})
export class InvitationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tokenService: TokenService) {}

  async handleConnection(client: Socket, ...args: any[]) {
//	const mock: Invitation = {
//		from: 'fde-capu',
//		to: 'fde-capu',
//		type: "Any type",
//		route: "/online"
//	}
//    try {
//		console.log("invite  handleConnection");
//      const { authorization } = parse(client.handshake.headers.cookie);
//      const { sub: subject } = await this.tokenService.inspect(authorization);
//      client['subject'] = subject;
//      client.emit('invitation', {
//        author: 'ft_transcendence',
//        payload: mock,
//      });
//    } catch (error) {
//      client.disconnect(true);
//    }
  }

  @SubscribeMessage('invitation')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
	console.log("Invitation got", payload);
    this.server.emit('invitation', {
      author: client['subject'],
      payload: payload,
    });
  }
}
