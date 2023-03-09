import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { U2uActionsRoutingModule } from './u2u-actions-routing.module';
import { U2uActionsComponent } from './u2u-actions.component';


@NgModule({
  declarations: [
	U2uActionsComponent,
  ],
  imports: [
    CommonModule,
	U2uActionsRoutingModule,
  ],
  exports: [
	U2uActionsComponent,
  ]
})
export class U2uActionsModule { }


