import { Component, Input } from '@angular/core';
import { User } from '../user';
import { Statistics } from '../statistics';
import { UserService } from '../user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
	constructor(
		private userService: UserService
	){};
	@Input() user?: User;
	stat?: Statistics;
	ngOnInit() {
		this.getStats();
	}
	async getStats(): Promise<void> {
		if (!this.user) {
			await new Promise(resolve => setTimeout(resolve, 211));
			return await this.getStats();
		}
		this.userService.getStats(this.user.intraId).subscribe(_=>{
			//console.log("Statistics got:", _);
			this.stat=_;
		});
	}
}
