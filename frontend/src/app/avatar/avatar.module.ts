import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarRoutingModule } from './avatar-routing.module';
import { AvatarComponent } from './avatar.component';
import { U2uActionsModule } from '../u2u-actions/u2u-actions.module';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
	AvatarComponent,
  ],
  imports: [
    CommonModule,
	U2uActionsModule,
	AppRoutingModule,
	AvatarRoutingModule,
  ],
  exports: [
	AvatarComponent
  ]
})
export class AvatarModule { }

