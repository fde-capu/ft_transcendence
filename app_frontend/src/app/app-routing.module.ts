import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FttAuthenticatorComponent } from './ftt-authenticator/ftt-authenticator.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [{
	path: "login",
	component: FttAuthenticatorComponent
},{
	path: "game",
	component: GameComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
