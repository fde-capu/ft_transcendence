import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './guard/auth.guard';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AuthRoutingModule],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
