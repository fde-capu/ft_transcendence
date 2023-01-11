import { Component } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'login',
  templateUrl: './ftt-authenticator.component.html',
  styleUrls: ['./ftt-authenticator.component.css'],
})
export class FttAuthenticatorComponent {
  constructor(private routes: AppRoutingModule){}
  ngOnInit() {
    console.log(document.cookie);
    if(document.cookie.split('=')[1])
    this.routes.navigate(
      ['/products'],
      { queryParams: { document.cookie.split('=')[0]: document.cookie.split('=')[1] } }
    );
    
    window.location.href =
      'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b02a235b40b43fcc4c00653871275c9f93069a8a1b6248f14c516166bfe94f6a&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fuser%2Fregister&response_type=code';
  }

  communicate_intra_id() {
    //		document.window.redirect('google.com');
    // Ver se usuário está logado. XXX
    // Se estiver logado, manda para rota main-game; XXX
    // Se não estiver logado, manda para API 42.
  }
}
