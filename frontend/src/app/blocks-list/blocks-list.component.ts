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
  blocks: User[] = [];
  ngOnChanges() {
		this.getBlocks();
  }
  async getBlocks() {
	this.userService.getBlocks(this.user).subscribe(_=>{
		//console.log("FriendsListComponent got", _);
		this.blocks = _;
	});
	await new Promise(resolve => setTimeout(resolve, 6543));
	this.getBlocks();
  }
}
