import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { GameHistory } from '../game-history';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css']
})
export class GameHistoryComponent {
  constructor(
    private userService: UserService,
  ) {}
	@Input() user: User|undefined;
  histRender: any[] = [];
  ngOnChanges(): void {this.getGameHistory();}
  getGameHistory(): void {
	if (!this.user) return ;
	//console.log("gGH for ", this.user.intraId);
	this.userService.getGameHistory(this.user.intraId).subscribe(_=>{
		//console.log("getGameHistory got", _);
		if (_)
		{
<<<<<<< HEAD
		  this.histRender = [];
=======
>>>>>>> main
		  for (const match of _) {
			let teams: any[] = [];

			if (match.mode == "PONG") {
				let victoryA = match.p1_goalsMade > match.p2_goalsMade;
				let victoryB = !victoryA;
				teams.push({
					victory: victoryA,
					players: [{
						intraId: match.p1_intraId,
						nameInGame: match.p1_nameInGame,
						scoreMade: match.p1_scoreMade,
						goalsMade: match.p1_goalsMade,
						goalsTaken: match.p1_goalsTaken,
					}],
				},{
					victory: victoryB,
					players: [{
						intraId: match.p2_intraId,
						nameInGame: match.p2_nameInGame,
						scoreMade: match.p2_scoreMade,
						goalsMade: match.p2_goalsMade,
						goalsTaken: match.p2_goalsTaken,
					}],
				})
			}

			if (match.mode == "PONG2") {
				let victoryA = match.p1_goalsMade + match.p2_goalsMade 
					> match.p3_goalsMade + match.p4_goalsMade;
				let victoryB = !victoryA;
				teams.push({
					victory: victoryA,
					players: [{
						intraId: match.p1_intraId,
						nameInGame: match.p1_nameInGame,
						scoreMade: match.p1_scoreMade,
						goalsMade: match.p1_goalsMade,
						goalsTaken: match.p1_goalsTaken,
					},{
						intraId: match.p2_intraId,
						nameInGame: match.p2_nameInGame,
						scoreMade: match.p2_scoreMade,
						goalsMade: match.p2_goalsMade,
						goalsTaken: match.p2_goalsTaken,
					}],
				},{
					victory: victoryB,
					players: [{
						intraId: match.p3_intraId,
						nameInGame: match.p3_nameInGame,
						scoreMade: match.p3_scoreMade,
						goalsMade: match.p3_goalsMade,
						goalsTaken: match.p3_goalsTaken,
					},{
						intraId: match.p4_intraId,
						nameInGame: match.p4_nameInGame,
						scoreMade: match.p4_scoreMade,
						goalsMade: match.p4_goalsMade,
						goalsTaken: match.p4_goalsTaken,
					}],
				})
			}

			if (match.mode == "PONG4") {
				let victoryA = match.p1_goalsMade > match.p2_goalsMade 
					&& match.p1_goalsMade > match.p3_goalsMade
					&& match.p1_goalsMade > match.p4_goalsMade;
				let victoryB = match.p2_goalsMade > match.p1_goalsMade 
					&& match.p2_goalsMade > match.p3_goalsMade
					&& match.p2_goalsMade > match.p4_goalsMade;
				let victoryC = match.p3_goalsMade > match.p1_goalsMade 
					&& match.p3_goalsMade > match.p2_goalsMade
					&& match.p3_goalsMade > match.p4_goalsMade;
				let victoryD = match.p4_goalsMade > match.p1_goalsMade 
					&& match.p4_goalsMade > match.p2_goalsMade
					&& match.p4_goalsMade > match.p3_goalsMade;

				teams.push({
					victory: victoryA,
					players: [{
						intraId: match.p1_intraId,
						nameInGame: match.p1_nameInGame,
						scoreMade: match.p1_scoreMade,
						goalsMade: match.p1_goalsMade,
						goalsTaken: match.p1_goalsTaken,
					}],
				},{
					victory: victoryB,
					players: [{
						intraId: match.p2_intraId,
						nameInGame: match.p2_nameInGame,
						scoreMade: match.p2_scoreMade,
						goalsMade: match.p2_goalsMade,
						goalsTaken: match.p2_goalsTaken,
					}],
				},{
					victory: victoryC,
					players: [{
						intraId: match.p3_intraId,
						nameInGame: match.p3_nameInGame,
						scoreMade: match.p3_scoreMade,
						goalsMade: match.p3_goalsMade,
						goalsTaken: match.p3_goalsTaken,
					}],
				},{
					victory: victoryD,
					players: [{
						intraId: match.p4_intraId,
						nameInGame: match.p4_nameInGame,
						scoreMade: match.p4_scoreMade,
						goalsMade: match.p4_goalsMade,
						goalsTaken: match.p4_goalsTaken,
					}],
				})
			}

			this.histRender.push({
				pongMode: match.mode,
				teams: teams,
				date: match.date,
				duration: match.duration,
			});
		  }
		}
	});
  }
  isUserIn(t: any)
  {
	for (const p of t.players)
		if (p.intraId == this.user?.intraId)
			return true;
	return false;
  }
}

