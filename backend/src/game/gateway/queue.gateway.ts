import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
    WebSocketServer,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { parse } from 'cookie';
  import { TokenService } from 'src/auth/service/token.service';
  import { Dictionary } from '../entity/game.entity';
  import { UserService } from 'src/user/service/user.service';
  import { RoomsService } from '../service/rooms.service';
  import { ClientSocket, GameMode, User } from '../entity/room.entity';
  import { environment } from 'src/environment';
  
  
  @WebSocketGateway({
    cors: { origin: environment.FRONTEND_ORIGIN, credentials: true },
    cookie: true,
    namespace: /queue/,
  })
  export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    queue: ClientSocket[] = [];
  
    public constructor(
      private readonly tokenService: TokenService,
      private readonly userService: UserService,
      private readonly roomsService: RoomsService,
    ) {}
  
    public async handleConnection(client: ClientSocket): Promise<void> {
      try {
        
        const { authorization } = parse(client.handshake.headers.cookie);
        const { sub: subject } = await this.tokenService.inspect(authorization);
        const { name, image } = await this.userService.getUserByIntraId(subject);
        client.name = name;
        client.subject = subject;
        client.image = image;
        this.queue.push(client);
        this.matchUsers();
      } catch (error) {
        client.emit('game:error', 'You are not authenticated!');
        client.disconnect(true);
      }
    }
  
    public async handleDisconnect(client: Socket): Promise<void> {
      this.queue = this.queue.filter((user) => user.id !== client.id);
      console.log('Remaining users:',  this.queue.map(user => user.id));
    
    }
  
    private matchUsers(): void {
      if (this.queue.length >= 2) {
        console.log("Two users at the queue");
        const user1 = this.queue.shift();
        const user2 = this.queue.shift();
        this.roomsService.roomQueueCreate(user1, user2);
      }
    }
  }
  