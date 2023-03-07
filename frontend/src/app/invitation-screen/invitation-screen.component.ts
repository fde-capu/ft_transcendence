import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css']
})
export class InvitationScreenComponent {
	public invite: Invitation[] = [{
		from: 'fde-caller',
		to: 'fde-capu',
		type: 'PRIVATE CHAT Blibuibs Barn',
		route: '/rooms'
	}];
	lastInvite?: Invitation;
  messages: { author: string; payload: string }[] = [];

	constructor (
		private readonly router: Router,
		private readonly invitationService: InvitationService,
	){
		console.log("invite constructor");
		this.socketSubscription();
	}

	socketSubscription() {
		console.log("Invitation subscribing.");
		this.invitationService.getInvitation().subscribe(
			_ => {
				console.log("Invitation subscription got", _);
				this.messages = [...this.messages, _];
				console.log("this.messages", this.messages);
			},
		);
	}

	accept() {
		this.finish();
		if (!this.lastInvite) return;
		this.lastInvite.answer = true;
		this.invitationService.sendReply(this.lastInvite);
		this.router.navigate([this.lastInvite.route]);
	}

	decline() {
		this.finish();
		if (!this.lastInvite) return;
		this.lastInvite.answer = false;
		this.invitationService.sendReply(this.lastInvite);
	}

	finish() {
		this.lastInvite = this.invite.shift();
	}
}
