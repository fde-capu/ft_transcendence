import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarRoutingModule } from './avatar-routing.module';
import { AvatarComponent } from './avatar.component';
import { U2uActionsModule } from '../u2u-actions/u2u-actions.module';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, U2uActionsModule, AvatarRoutingModule],
  exports: [AvatarComponent],
})
export class AvatarModule {}
