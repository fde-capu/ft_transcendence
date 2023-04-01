import { Component, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-blocks-list',
  templateUrl: './blocks-list.component.html',
  styleUrls: ['./blocks-list.component.css']
})
export class BlocksListComponent {
  constructor(
    private userService: UserService,
  ) {}
	@Input() user: User | undefined;
	oldId: string = "";
  blocks: User[] = [];
  ngOnChanges() {
		this.getBlocks();
  }
  async getBlocks() : Promise<void> {
	if ((!this.user) || (this.oldId == this.user.intraId)) {
		await new Promise(resolve => setTimeout(resolve, 5239));
		return await this.getBlocks();
	}
	this.oldId = this.user.intraId;
	this.userService.getBlocks(this.user).subscribe(_=>{
		//console.log("FriendsListComponent got", _);
		this.blocks = _;
	});
  }
}
