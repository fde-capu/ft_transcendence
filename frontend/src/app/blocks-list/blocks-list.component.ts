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
  blocks: User[] = [];

  constructor(private userService: UserService) {}

  ngOnChanges() {
    this.getBlocks();
  }

  async getBlocks() {
    this.userService.getBlocks(this.user).subscribe(_ => {
      this.blocks = _;
    });
    await new Promise(resolve => setTimeout(resolve, 6543));
    this.getBlocks();
  }
}
