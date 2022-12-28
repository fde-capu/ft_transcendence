import { Component } from '@angular/core';

@Component({
  selector: 'ftt-authenticator',
  templateUrl: './ftt-authenticator.component.html',
  styleUrls: ['./ftt-authenticator.component.css']
})
export class FttAuthenticatorComponent {
	communicate_intra_id()
	{
		// Aqui seria para fazer autenticação com a Intra 42,
		// para isso seria necessário receber o formulário,
		// porém, aparentemente a API já fornece uma página de login.
	}
}
