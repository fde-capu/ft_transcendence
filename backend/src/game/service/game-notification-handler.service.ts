import { Injectable } from '@nestjs/common';
import { filter } from 'rxjs';
import { NotificationService } from 'src/notification/service/notification.service';
import { RoomsService } from './rooms.service';
import { User } from '../entity/room.entity';

@Injectable()
export class GameNotificationHandlerService {
  public constructor(
    private readonly notificationService: NotificationService,
    private readonly roomsService: RoomsService,
  ) {
    this.gameInviteAccepted();
    this.gameInviteDeclined();
  }

  private gameInviteAccepted(): void {
    this.notificationService
      .subscribeToNotifications()
      .pipe(
        filter(
          (n) =>
            !!n.toSocketId &&
            !!n.fromSocketId &&
            n.template === 'game:invite' &&
            n.answer === 'game:invite:accept',
        ),
      )
      .subscribe({
        next: (n) => {
          const roomId = this.roomsService.roomCreate();
          const roomPath = `/game/${roomId}`;
          this.notificationService.requestRedirect(n.fromSocketId, roomPath);
          this.notificationService.requestRedirect(n.toSocketId, roomPath);
        },
      });
  }

  private gameInviteDeclined(): void {
    this.notificationService
      .subscribeToNotifications()
      .pipe(
        filter(
          (n) =>
            !!n.toSocketId &&
            !!n.fromSocketId &&
            n.template === 'game:invite' &&
            n.answer === 'game:invite:decline',
        ),
      )
      .subscribe({
        next: (n) =>
          this.notificationService.createNotification({
            fromSocketId: n.toSocketId,
            from: n.to,
            toSocketId: n.fromSocketId,
            to: n.from,
            template: 'game:invite:decline',
            expiresAt: new Date(Date.now() + 1000 * 15),
            extra: {},
          }),
      });
  }
}
