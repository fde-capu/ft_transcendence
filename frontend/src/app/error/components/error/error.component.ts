import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  cause: string;

  description: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location
  ) {
    this.cause =
      route.snapshot.queryParamMap.get('cause') ||
      'Parece que você foi longe demais';
    this.description =
      route.snapshot.queryParamMap.get('description') ||
      'Que tal voltar e jogar uma bela partida de pong?';
  }

  goBack() {
    this.location.back();
  }
}
