import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  constructor(private route: ActivatedRoute) {}

  intraId = 'undefined_intraId';
  fullName = 'undefined_fullName';
  avatarLink = 'undefined_avatarLink';

  ngOnInit() {
  }
}
