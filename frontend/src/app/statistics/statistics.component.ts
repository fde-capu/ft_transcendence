import { Component, Input } from '@angular/core';
import { User } from '../user';
import { Statistics } from '../statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
  @Input() user?: User;
  stat?: Statistics = {
    goalsMade: 0,
    goalsMadePerTaken: 0,
    goalsTaken: 0,
    looses: 0,
    matches: 0,
    playingTime: 0,
    score: 0,
    scorePerMatches: 0,
    scorePerMinute: 0,
    wins: 0,
    winsPerLooses: 0,
  };
}
