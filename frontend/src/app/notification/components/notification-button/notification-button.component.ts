import { Component, Input } from '@angular/core';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-notification-button',
  templateUrl: './notification-button.component.html',
  styleUrls: ['./notification-button.component.css'],
})
export class NotificationButtonComponent {
  @Input() to!: string;

  @Input() template!: string;

  @Input() timeoutSeconds?: number;

  @Input() extra: Record<string, string> = {};

  @Input() alternativeText = 'Invite sent';

  enabled = true;

  constructor(private readonly notificationService: NotificationService) {}

  create() {
    this.notificationService.createNotification({
      to: { intraId: this.to },
      template: this.template,
      extra: this.extra,
      expiresAt: this.timeoutSeconds
        ? new Date(Date.now() + this.timeoutSeconds * 1000)
        : undefined,
    });

    this.enabled = false;
    setTimeout(() => (this.enabled = true), 60000);
  }
}
