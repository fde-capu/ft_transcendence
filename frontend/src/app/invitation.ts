export interface Invitation {
	from: string;
	to: string;
	type: string;
	route: string;
	answer?: boolean;
}
