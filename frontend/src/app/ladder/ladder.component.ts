import { Component, Input, OnChanges } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-ladder',
  templateUrl: './ladder.component.html',
  styleUrls: ['./ladder.component.css'],
})
export class LadderComponent implements OnChanges {
  maxScore = 0;
  ladder: any = [];

  @Input() user?: User;
  @Input() them?: User;
  constructor(
    private readonly userService: UserService,
    private readonly fun: HelperFunctionsService
  ) {}

  ngOnChanges() {
    this.userService.getLadder().subscribe(_ => {
      this.ladder = _;
      this.ladder.sort(function (a: any, b: any) {
        return b.score - a.score;
      });
      let i = 0;
      for (const s of this.ladder) {
        s.position = ++i;
        this.maxScore = s.score >= this.maxScore ? s.score : this.maxScore;
      }
    });
  }

  async showMyself() {
    this.fun.focus('focusMe');
    this.fun.blink3('focusMe');
  }

  async showUserPosition() {
    this.fun.focus('focusThem');
    this.fun.blink3('focusThem');
  }
}
