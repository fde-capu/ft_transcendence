import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { HomeComponent } from './home/home.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ChatTextComponent } from './chat-text/chat-text.component';
import { RenderFilterComponent } from './render-filter/render-filter.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { WindowTitleComponent } from './window-title/window-title.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ChatRoomListComponent } from './chat-room-list/chat-room-list.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { LogOutComponent } from './log-out/log-out.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { UserBarComponent } from './user-bar/user-bar.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    FttAuthenticatorComponent,
    HomeComponent,
    HomeComponent,
    AvatarComponent,
    ProfileComponent,
    OnlineUsersComponent,
    ChatTextComponent,
    RenderFilterComponent,
    MenuBarComponent,
    ChatInputComponent,
    ChatBoxComponent,
    WindowTitleComponent,
	MainMenuComponent,
	ChatRoomListComponent,
	CreateMatchComponent,
 LogOutComponent,
 FriendsListComponent,
 UserBarComponent,
 StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
