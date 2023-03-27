export interface Invitation {
	from?: string;
	to: string;
	type?: string;
	buttonOk?: string;
	buttonCancel?: string;
	route?: string;
	answer?: boolean;
	isReply?: boolean;
	instantaneous?: boolean;
	note?: string;
	button?: string;
	routeBefore?: boolean;
}

export interface InviteState {
	receiveScreen: boolean,
	declineScreen: boolean,
	acceptScreen: boolean,
	sentScreen: boolean,
	notificationScreen: boolean,
	invitation?: Invitation,
}

