import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css'],
})
export class GameHistoryComponent implements OnChanges {
  @Input() user?: User;
  histRender: any[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges(): void {
    this.getGameHistory();
  }

  getGameHistory(): void {
    if (!this.user) return;
    this.userService.getGameHistory(this.user.intraId).subscribe(_ => {
      if (_) {
        this.histRender = [];
        for (const match of _) {
          const teams: any[] = [];

          if (match.mode == 'PONG') {
            const victoryA = match.p1_goalsMade > match.p2_goalsMade;
            const victoryB = !victoryA;
            teams.push(
              {
                victory: victoryA,
                players: [
                  {
                    intraId: match.p1_intraId,
                    nameInGame: match.p1_nameInGame,
                    scoreMade: match.p1_scoreMade,
                    goalsMade: match.p1_goalsMade,
                    goalsTaken: match.p1_goalsTaken,
                  },
                ],
              },
              {
                victory: victoryB,
                players: [
                  {
                    intraId: match.p2_intraId,
                    nameInGame: match.p2_nameInGame,
                    scoreMade: match.p2_scoreMade,
                    goalsMade: match.p2_goalsMade,
                    goalsTaken: match.p2_goalsTaken,
                  },
                ],
              }
            );
          }

          if (match.mode == 'PONG2') {
            const victoryA =
              match.p1_goalsMade + match.p2_goalsMade >
              match.p3_goalsMade + match.p4_goalsMade;
            const victoryB = !victoryA;
            teams.push(
              {
                victory: victoryA,
                players: [
                  {
                    intraId: match.p1_intraId,
                    nameInGame: match.p1_nameInGame,
                    scoreMade: match.p1_scoreMade,
                    goalsMade: match.p1_goalsMade,
                    goalsTaken: match.p1_goalsTaken,
                  },
                  {
                    intraId: match.p2_intraId,
                    nameInGame: match.p2_nameInGame,
                    scoreMade: match.p2_scoreMade,
                    goalsMade: match.p2_goalsMade,
                    goalsTaken: match.p2_goalsTaken,
                  },
                ],
              },
              {
                victory: victoryB,
                players: [
                  {
                    intraId: match.p3_intraId,
                    nameInGame: match.p3_nameInGame,
                    scoreMade: match.p3_scoreMade,
                    goalsMade: match.p3_goalsMade,
                    goalsTaken: match.p3_goalsTaken,
                  },
                  {
                    intraId: match.p4_intraId,
                    nameInGame: match.p4_nameInGame,
                    scoreMade: match.p4_scoreMade,
                    goalsMade: match.p4_goalsMade,
                    goalsTaken: match.p4_goalsTaken,
                  },
                ],
              }
            );
          }

          if (match.mode == 'PONG4') {
            const victoryA =
              match.p1_goalsMade > match.p2_goalsMade &&
              match.p1_goalsMade > match.p3_goalsMade &&
              match.p1_goalsMade > match.p4_goalsMade;
            const victoryB =
              match.p2_goalsMade > match.p1_goalsMade &&
              match.p2_goalsMade > match.p3_goalsMade &&
              match.p2_goalsMade > match.p4_goalsMade;
            const victoryC =
              match.p3_goalsMade > match.p1_goalsMade &&
              match.p3_goalsMade > match.p2_goalsMade &&
              match.p3_goalsMade > match.p4_goalsMade;
            const victoryD =
              match.p4_goalsMade > match.p1_goalsMade &&
              match.p4_goalsMade > match.p2_goalsMade &&
              match.p4_goalsMade > match.p3_goalsMade;

            teams.push(
              {
                victory: victoryA,
                players: [
                  {
                    intraId: match.p1_intraId,
                    nameInGame: match.p1_nameInGame,
                    scoreMade: match.p1_scoreMade,
                    goalsMade: match.p1_goalsMade,
                    goalsTaken: match.p1_goalsTaken,
                  },
                ],
              },
              {
                victory: victoryB,
                players: [
                  {
                    intraId: match.p2_intraId,
                    nameInGame: match.p2_nameInGame,
                    scoreMade: match.p2_scoreMade,
                    goalsMade: match.p2_goalsMade,
                    goalsTaken: match.p2_goalsTaken,
                  },
                ],
              },
              {
                victory: victoryC,
                players: [
                  {
                    intraId: match.p3_intraId,
                    nameInGame: match.p3_nameInGame,
                    scoreMade: match.p3_scoreMade,
                    goalsMade: match.p3_goalsMade,
                    goalsTaken: match.p3_goalsTaken,
                  },
                ],
              },
              {
                victory: victoryD,
                players: [
                  {
                    intraId: match.p4_intraId,
                    nameInGame: match.p4_nameInGame,
                    scoreMade: match.p4_scoreMade,
                    goalsMade: match.p4_goalsMade,
                    goalsTaken: match.p4_goalsTaken,
                  },
                ],
              }
            );
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

  isUserIn(t: any) {
    for (const p of t.players) if (p.intraId == this.user?.intraId) return true;
    return false;
  }
}
