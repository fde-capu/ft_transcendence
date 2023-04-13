import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { filter } from 'rxjs';

@Injectable()
export class NotificationRoutesService {
  public constructor(
    private readonly notificationService: NotificationService,
  ) {
    this.chatInviteAccepted();
    this.chatInviteDeclined();
    this.notificationService
      .subscribeToNotifications()
      .subscribe({ next: (n) => console.log(n) });
  }

  private chatInviteAccepted(): void {
    this.notificationService
      .subscribeToNotifications()
      .pipe(
        filter(
          (n) =>
            !!n.toSocketId &&
            !!n.extra['route'] &&
            n.template === 'chat:invite' &&
            n.answer === 'chat:invite:accept',
        ),
      )
      .subscribe({
        next: (n) =>
          this.notificationService.requestRedirect(
            n.toSocketId,
            n.extra['route'],
          ),
      });
  }

  private chatInviteDeclined(): void {
    this.notificationService
      .subscribeToNotifications()
      .pipe(
        filter(
          (n) =>
            !!n.toSocketId &&
            n.template === 'chat:invite' &&
            n.answer === 'chat:invite:decline',
        ),
      )
      .subscribe({
        next: (n) =>
          this.notificationService.createNotification({
            fromSocketId: n.toSocketId,
            from: n.to,
            toSocketId: n.fromSocketId,
            to: n.from,
            template: 'chat:invite:decline',
            expiresAt: new Date(Date.now() + 1000 * 15),
            extra: {},
          }),
      });
  }
}
