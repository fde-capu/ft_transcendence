import { Injectable } from '@angular/core';
import { NotificationSocket } from '../socket/notification.socket';
import { Notification } from '../entity/notification.entity';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private nonDisturbMode = false;

  private notificationsQueue: Array<Notification> = [];

  private currentNotification = new BehaviorSubject<Notification | null>(null);

  public constructor(private readonly notificationSocket: NotificationSocket) {
    this.subscribeToNotifications();
  }

  public getCurrentNotification(): Observable<Notification | null> {
    return this.currentNotification.asObservable();
  }

  public answerNotification(notification: Pick<Notification, 'id' | 'answer'>) {
    this.notificationSocket.emit('notification:answer', notification);
    this.nextNotification();
  }

  public createNotification(
    notification: Omit<Notification, 'id' | 'answerable' | 'answer'>
  ): void {
    this.notificationSocket.emit('notification:create', notification);
  }

  public setNonDisturbMode(nonDisturbMode: boolean) {
    console.dir(this.notificationsQueue);
    if (this.nonDisturbMode === nonDisturbMode) return;

    this.nonDisturbMode = nonDisturbMode;

    if (nonDisturbMode && this.currentNotification.value) {
      this.notificationsQueue = [
        this.currentNotification.value,
        ...this.notificationsQueue,
      ];
      this.currentNotification.next(null);
    } else this.nextNotification();
  }

  private nextNotification() {
    const [head, ...tail] = this.notificationsQueue;
    this.notificationsQueue = tail;
    this.currentNotification.next(head);
  }

  private subscribeToNotifications() {
    this.notificationSocket
      .fromEvent<Array<Notification>>('notification:list')
      .subscribe({
        next: notifications => {
          this.notificationsQueue = notifications;
          this.nextNotification();
        },
      });
  }
}
