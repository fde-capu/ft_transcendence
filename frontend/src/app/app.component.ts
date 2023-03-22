import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChatService } from './chat.service';
import { UserService } from './user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PONG!'; // TODO: Take this away.
  constructor(
	public router: Router,
	public chatService: ChatService,
	public userService: UserService,
  ){};
  ngOnInit() {
		setInterval(function(){
			const skrollers = Array.from(document.getElementsByClassName('scroller'));
			for (const x of skrollers)
			{
				const k = <HTMLElement> x;
				k.scrollTo(0, 999999);
			}
		}, 1000);
		this.router.events.subscribe(event=>{
			if (event instanceof NavigationEnd)
			{
				//console.log("Router got change");
				if (this.router.url.indexOf('/chat') != 0) {
					//console.log("Getting out of all chats.");
					this.chatService.getOutOfAnyChat();
				}
			}
		});
		window.addEventListener('beforeunload', () => {
//	this.chatService.getOutOfAnyChat();
//	this.userService.signOut();
		});
  }
  ngOnDestroy() {
//	alert('Destroy!');
//	this.chatService.getOutOfAnyChat();
//	this.userService.signOut();
  }
}
