import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PONG!'; // TODO: Take this away.
  ngOnInit() {
		setInterval(function(){
			const skrollers = Array.from(document.getElementsByClassName('scroller'));
			for (const x of skrollers)
			{
				const k = <HTMLElement> x;
				k.scrollTo(0, 999999);
			}
		}, 1000);
  }
}
