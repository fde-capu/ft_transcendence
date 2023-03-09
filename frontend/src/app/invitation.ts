export interface Invitation {
	from: string;
	to: string;
	type: string;
	buttonOk?: string;
	buttonCancel?: string;
	route: string;
	answer?: boolean;
	isReply: boolean;
	instantaneous?: boolean;
}
