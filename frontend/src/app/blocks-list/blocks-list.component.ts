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

  ngOnChanges(): void {
    this.getBlocks();
  }

  getBlocks(): void {
    this.userService.getBlocks(this.user).subscribe(blocks => {
      this.blocks = blocks;
    });
  }
}
