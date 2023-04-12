import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';

@NgModule({
  declarations: [NotificationComponent, NotificationModalComponent],
  imports: [CommonModule],
  exports: [NotificationComponent],
})
export class NotificationModule {}
