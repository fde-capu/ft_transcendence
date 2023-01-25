import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';
import { UserModule } from './user/user.module';
import { HomeComponent } from './home/home.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [AppComponent, FttAuthenticatorComponent, GameComponent, HomeComponent, HomeComponent, AvatarComponent, ProfileComponent],
  imports: [BrowserModule, AppRoutingModule, UserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
