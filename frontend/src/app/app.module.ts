import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { UserModule } from './user/user.module';
import { SocketIoModule } from 'ngx-socket-io';

@NgModule({
  declarations: [AppComponent, FttAuthenticatorComponent],
  imports: [BrowserModule, AppRoutingModule, UserModule, SocketIoModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
