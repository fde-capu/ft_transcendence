import { Component, Input } from '@angular/core';
import { User } from '../user';
import { Statistics } from '../statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
	@Input() user?: User;
	stat: Statistics = {} as Statistics;
	ngOnInit() {
		this.stat.score = 0;
		this.stat.matches = 0;
		this.stat.scorePerMatches = 0;
		this.stat.ranking = 0;
		this.stat.wins = 0;
		this.stat.looses = 0;
		this.stat.winsPerLooses = 0;
		this.stat.goalsMade = 0;
		this.stat.goalsTaken = 0;
		this.stat.goalsMadePerTaken = 0;
	}
}
