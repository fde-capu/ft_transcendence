export interface GameHistory {
	mode: string;
	date: string;
	duration: number;

	p1_intraId: string;
	p1_nameInGame: string;
	p1_scoreMade: number;
	p1_goalsMade: number;
	p1_goalsTaken: number;

	p2_intraId: string;
	p2_nameInGame: string;
	p2_scoreMade: number;
	p2_goalsMade: number;
	p2_goalsTaken: number;

	p3_intraId: string;
	p3_nameInGame: string;
	p3_scoreMade: number;
	p3_goalsMade: number;
	p3_goalsTaken: number;

	p4_intraId: string;
	p4_nameInGame: string;
	p4_scoreMade: number;
	p4_goalsMade: number;
	p4_goalsTaken: number;
}
