import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../entity/notification.entity';
import { User } from 'src/app/user';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notification?: Notification;

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getCurrentNotification().subscribe({
      next: notification => {
        this.notification = notification || undefined;
      },
    });
  }

  answer(answer?: string) {
    if (!this.notification) return;

    this.notificationService.answerNotification({
      id: this.notification.id,
      answer,
    });
  }

  create(intraId: string, template: string) {
    const user = { intraId } as User;
    this.notificationService.createNotification({
      to: user,
      template,
      extra: {},
    });
  }

  setNonDisturbeMode(status: boolean) {
    this.notificationService.setNonDisturbMode(status);
  }
}
