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
import { AuthController } from 'src/auth/controller/auth.controller';

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
  static attendance: Map<string, number> = new Map<string, number>;

  constructor(
	private readonly tokenService: TokenService,
	private readonly authController: AuthController,
  ) {
	this.checkOnStudents();
  }

  async handleConnection(client: Socket, ...args: any[]) { }

  async checkOnStudents() {
	await new Promise(resolve => setTimeout(resolve, 3391));
	if (!InvitationGateway.attendance) return this.checkOnStudents();
	for (const [u, d] of InvitationGateway.attendance.entries()) {
		let elapsed = Date.now() - d;
		console.log(" > ", u, d, elapsed);
		if (elapsed > 5555) {
			InvitationGateway.attendance.delete(u);
			console.log(u, "....~~~> OFFLINE");
			this.server.emit('user_status_update', 
{ 'user_status_update' : [ u, 'OFFLINE' ] },
			);
//			this.authController.markOffline(u);
		}
	}
	this.checkOnStudents();
  }

  @SubscribeMessage('present')
  takeAttendance(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
	let data: any;
	data = payload;
	console.log("---> Roll ---> ", data.attendant);
	if (!InvitationGateway.attendance.get(data.attendant)) {
		console.log(data.attendant, "....~~~> ONLINE");
		this.server.emit('user_status_update',
{ 'user_status_update' : [ u, 'ONLINE' ] },
		);
	}
//		this.authController.markOnline(data.attendant);
	InvitationGateway.attendance.set(data.attendant, Date.now());
  }

  @SubscribeMessage('invitation')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ) {
	//console.log("Invitation got", payload);
    this.server.emit('invitation', {
      author: client['subject'],
      payload: payload,
    });
  }
}
