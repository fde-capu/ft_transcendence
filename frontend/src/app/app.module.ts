import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [AppComponent, FttAuthenticatorComponent, GameComponent],
  imports: [BrowserModule, AppRoutingModule, UserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
