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
  ngOnChanges(): void {this.getBlocks();}
  getBlocks(): void {
	this.userService.getBlocks(this.user).subscribe(_=>{
		//console.log("FriendsListComponent got", _);
		this.blocks = _;
	});
  }
}
