import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation } from '../invitation';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './invitation-screen.component.html',
  styleUrls: ['./invitation-screen.component.css']
})
export class InvitationScreenComponent {
	public invite: Invitation[] = [];
	lastInvite?: Invitation;
	user?: User;

	constructor (
		private readonly userService: UserService,
		private readonly invitationService: InvitationService,
	){}

	ngOnInit() {
		console.log("invite init");
		this.getUser();
		this.socketSubscription();
		this.invitationService.invite(
			{
				from: 'fde-caller',
				to: 'fde-capu',
				type: 'PRIVATE CHAT Blibuibs Barn',
				route: '/rooms'
			}
		);
	}

	getUser(): void {
		this.userService.getLoggedUser().subscribe(
			backUser => { this.user = backUser; }
		)
	}

	socketSubscription() {
		console.log("Invitation subscribing.");
		this.invitationService.getInvitation().subscribe(
			_ => {
				console.log("Invitation subscription got", _);
				if (_.payload.to == this.user?.intraId)
					this.invite.push(_.payload);
			},
		);
	}

	accept() {
		this.finish();
		if (!this.lastInvite) return;
		this.invitationService.replyTrue(this.lastInvite);
	}

	decline() {
		this.finish();
		if (!this.lastInvite) return;
		this.invitationService.replyFalse(this.lastInvite);
	}

	finish() {
		this.lastInvite = this.invite.shift();
	}
}
