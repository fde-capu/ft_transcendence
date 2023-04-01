import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChatService } from './chat.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  cleanChat = false;

  constructor(
    public router: Router,
    public chatService: ChatService,
    public userService: UserService
  ) {}

  ngOnInit() {
    setInterval(function () {
      const skrollers = Array.from(document.getElementsByClassName('scroller'));
      for (const x of skrollers) {
        const k = <HTMLElement>x;
        k.scrollTo(0, 999999);
      }
    }, 1000);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.indexOf('/chat') != 0) {
          if (!this.cleanChat) this.chatService.getOutOfAnyChat();
          this.cleanChat = true;
        } else this.cleanChat = false;
      }
    });
  }
}
