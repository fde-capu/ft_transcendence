import { Component, Input, OnChanges } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-blocks-list',
  templateUrl: './blocks-list.component.html',
  styleUrls: ['./blocks-list.component.css'],
})
export class BlocksListComponent implements OnChanges {
  @Input() user?: User;
  oldId = '';
  blocks: User[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges() {
    this.getBlocks();
  }

  async getBlocks(): Promise<void> {
    if (!this.user || this.oldId == this.user.intraId) {
      await new Promise(resolve => setTimeout(resolve, 239));
      return await this.getBlocks();
    }
    this.oldId = this.user.intraId;
		const t = this.userService.getBlocks(this.user);
		if (t)
			this.blocks = t;
    await new Promise(resolve => setTimeout(resolve, 6241));
    this.getBlocks();
  }
}
