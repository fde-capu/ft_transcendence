import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { NotificationButtonComponent } from './components/notification-button/notification-button.component';

@NgModule({
  declarations: [
    NotificationComponent,
    NotificationModalComponent,
    NotificationButtonComponent,
  ],
  imports: [CommonModule],
  exports: [NotificationComponent, NotificationButtonComponent],
})
export class NotificationModule {}
