import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { Statistics } from '../statistics';
import { UserService } from '../user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnChanges {
  constructor(private userService: UserService) {}
  @Input() user?: User;
  stat?: Statistics;
  ngOnChanges() {
    this.getStats();
  }
  getStats() {
    if (!this.user) return;
    this.userService.getStats(this.user.intraId).subscribe(_ => {
      //console.log("Statistics got:", _);
      this.stat = _;
    });
  }
}
