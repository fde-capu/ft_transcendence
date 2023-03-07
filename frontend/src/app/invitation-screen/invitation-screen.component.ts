import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface Invitation {
	caller: string;
	type: string;
	route: string;
}

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css']
})
export class InvitationScreenComponent {
	public invite: Invitation[] = [{
		caller: 'fde-caller',
		type: 'PRIVATE CHAT Blibuibs Barn',
		route: '/rooms'
	}];
	lastInvite?: Invitation;

	constructor (
		private readonly router: Router,
	){}

	accept() {
		this.finish();
		if (!this.lastInvite) return;
		this.router.navigate([this.lastInvite.route]);
	}

	decline() {
		this.finish();
	}

	finish() {
		this.lastInvite = this.invite.shift();
	}
}
