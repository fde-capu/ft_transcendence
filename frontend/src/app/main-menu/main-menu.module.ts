import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuRoutingModule } from './main-menu-routing.module';
import { MainMenuComponent } from './main-menu.component';

@NgModule({
  declarations: [MainMenuComponent],
  imports: [CommonModule, MainMenuRoutingModule],
  exports: [MainMenuComponent],
})
export class MainMenuModule {}
