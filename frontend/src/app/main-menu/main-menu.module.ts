import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuRoutingModule } from './main-menu-routing.module';
import { MainMenuComponent } from './main-menu.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
	MainMenuComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
	MainMenuRoutingModule,
  ],
  exports: [
	MainMenuComponent,
  ]
})
export class MainMenuModule { }



