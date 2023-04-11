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
  
  interface QueueUser {
    socket: Socket;
    username: string;
    image: string;
  }
  
  @WebSocketGateway({
    cors: { origin: environment.FRONTEND_ORIGIN, credentials: true },
    cookie: true,
    namespace: /queue/,
  })
  export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    queue: QueueUser[] = [];
  
    public constructor(
      private readonly tokenService: TokenService,
      private readonly userService: UserService,
      private readonly roomsService: RoomsService,
    ) {}
  
    public async handleConnection(client: Socket): Promise<void> {
      try {
        const { authorization } = parse(client.handshake.headers.cookie);
  
        const { sub: subject } = await this.tokenService.inspect(authorization);
        const { name, image } = await this.userService.getUserByIntraId(subject);
        this.queue.push({
          socket: client,
          username: name,
          image: image,
        });
        this.matchUsers();
      } catch (error) {
        client.emit('game:error', 'You are not authenticated!');
        client.disconnect(true);
      }
    }
  
    public handleDisconnect(client: Socket): void {
      this.queue = this.queue.filter((user) => user.socket.id !== client.id);
    }
  
    private matchUsers(): void {
      if (this.queue.length >= 2) {
        const user1 = this.queue.shift();
        const user2 = this.queue.shift();
        /* Criar a sala. 
        const roomId = this.roomsService.createRoom(user1.socket.nsp.name, [
          user1,
          user2,
        ]);
        */
       //Fazer os usuários entrarem na sala. 
        //user1.socket.emit('game:room:join', roomId);
        //user2.socket.emit('game:room:join', roomId);
      }
    }
  }
  