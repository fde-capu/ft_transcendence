import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  constructor(private route: ActivatedRoute) {}

  intraId = 'foo_name';
  fullName = 'Foo da Silva';
  avatarLink = 'https://intra.42.fr/...';

  ngOnInit() {
    const name = this.route.snapshot.queryParamMap.get('acess_token');
    console.log(name);
  }
}
