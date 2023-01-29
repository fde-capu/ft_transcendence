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
      'An error! Why did this happen?';
    this.description =
      route.snapshot.queryParamMap.get('description') ||
      'You have sent a PING, but this is PONG!';
  }

  goBack() {
    this.location.back();
  }
}
