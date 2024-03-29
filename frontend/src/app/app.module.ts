import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ChatTextComponent } from './chat-text/chat-text.component';
import { RenderFilterComponent } from './render-filter/render-filter.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatRoomListComponent } from './chat-room-list/chat-room-list.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { LogOutComponent } from './log-out/log-out.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { BlocksListComponent } from './blocks-list/blocks-list.component';
import { UserBarComponent } from './user-bar/user-bar.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MenuBarModule } from './menu-bar/menu-bar.module';
import { AvatarModule } from './avatar/avatar.module';
import { MainMenuModule } from './main-menu/main-menu.module';
import { InviteModule } from './invitation.module';
import { GameModule } from './game/game.module';
import { NotificationModule } from './notification/notification.module';
import { FindGameComponent } from './find-game/find-game.component';
import { ChangeNameComponent } from './change-name/change-name.component';

@NgModule({
  declarations: [
    AppComponent,
    FttAuthenticatorComponent,
    HomeComponent,
    HomeComponent,
    ProfileComponent,
    OnlineUsersComponent,
    ChatTextComponent,
    RenderFilterComponent,
    ChatInputComponent,
    ChatBoxComponent,
    ChatRoomListComponent,
    CreateMatchComponent,
    LogOutComponent,
    FriendsListComponent,
    BlocksListComponent,
    UserBarComponent,
    StatisticsComponent,
    FindGameComponent,
    ChangeNameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    LoginModule,
    FormsModule,
    MenuBarModule,
    AvatarModule,
    MainMenuModule,
    InviteModule,
    GameModule,
    NotificationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
