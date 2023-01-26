import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { UserService } from './service/user.service';
import { UserResolver } from './resolver/user.resolver';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, UserRoutingModule],
  providers: [UserService, UserResolver],
})
export class UserModule {}
