import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  constructor(private route: ActivatedRoute) {}

  intraId: string = 'undefined_intraId';
  fullName: string = 'undefined_fullName';
  avatarLink: string = 'undefined_avatarLink';

  ngOnInit() {
    const name = this.route.snapshot.queryParamMap.get('acess_token');
    console.log("GameComponent init: name", name);
  }
}
