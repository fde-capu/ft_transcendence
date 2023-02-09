import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, QRCodeModule],
})
export class LoginModule {}
