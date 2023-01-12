import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const name = this.route.snapshot.queryParamMap.get('acess_token');
    console.log(name);
  }
}
