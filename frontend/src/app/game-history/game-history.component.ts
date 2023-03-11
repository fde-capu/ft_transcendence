import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { GameHistory } from '../game-history';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css'],
})
export class GameHistoryComponent implements OnChanges {
  constructor(private userService: UserService) {}
  @Input() user: User | undefined;
  history: GameHistory[] = [];
  ngOnChanges(): void {
    this.getGameHistory();
  }
  getGameHistory(): void {
    if (!this.user) return;
    this.userService.getGameHistory(this.user.intraId).subscribe(_ => {
      if (_) this.history = _;
    });
  }
}
