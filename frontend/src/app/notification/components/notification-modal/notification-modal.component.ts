import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css'],
})
export class NotificationModalComponent {
  @Input() title?: string;
}
