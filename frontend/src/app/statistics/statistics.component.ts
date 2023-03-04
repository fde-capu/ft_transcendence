import { Component, Input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
	@Input() user?: User;
}
