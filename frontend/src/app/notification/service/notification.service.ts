import { Injectable } from '@angular/core';
import { NotificationSocket } from '../socket/notification.socket';
import { Notification } from '../entity/notification.entity';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private nonDisturbMode = false;

  private notificationsQueue: Array<Notification> = [];

  private readonly currentNotification$ =
    new BehaviorSubject<Notification | null>(null);

  private readonly notificationAnswered$ = new Subject<Notification>();

  public constructor(
    private readonly notificationSocket: NotificationSocket,
    private readonly router: Router
  ) {
    this.subscribeToNotifications();
    this.subscribeToRedirectRequest();
  }

  public getCurrentNotification(): Observable<Notification | null> {
    return this.currentNotification$.asObservable();
  }

  public answerNotification(notification: Notification) {
    this.notificationSocket.emit('notification:answer', notification);
    this.notificationAnswered$.next(notification);
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

    if (nonDisturbMode && this.currentNotification$.value) {
      this.notificationsQueue = [
        this.currentNotification$.value,
        ...this.notificationsQueue,
      ];
      this.currentNotification$.next(null);
    } else this.nextNotification();
  }

  private nextNotification() {
    const [head, ...tail] = this.notificationsQueue;
    this.notificationsQueue = tail;
    this.currentNotification$.next(head);
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

  private subscribeToRedirectRequest() {
    this.notificationSocket
      .fromEvent<string>('notification:redirect')
      .subscribe({
        next: path => this.redirectToPath(path),
      });
  }

  private redirectToPath(path: string) {
    if (this.router.url !== path && !this.nonDisturbMode)
      this.router.navigate([path]);
  }
}
