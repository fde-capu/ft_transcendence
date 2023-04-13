import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../entity/notification.entity';

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
}
