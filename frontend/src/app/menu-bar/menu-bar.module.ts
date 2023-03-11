import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from './menu-bar.component';
import { AvatarModule } from '../avatar/avatar.module';
import { U2uActionsModule } from '../u2u-actions/u2u-actions.module';
import { MenuBarRoutingModule } from './menu-bar-routing.module';
import { MainMenuModule } from '../main-menu/main-menu.module';


@NgModule({
  declarations: [
	MenuBarComponent,
  ],
  imports: [
    CommonModule,
	AvatarModule,
	U2uActionsModule,
	MainMenuModule,
	MenuBarRoutingModule,
  ],
  exports: [
	MenuBarComponent,
	AvatarModule,
	U2uActionsModule,
	MainMenuModule,
  ]
})
export class MenuBarModule { }
