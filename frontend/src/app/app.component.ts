import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { OnlineSocket } from './online.socket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  cleanChat = false;
  oldRoute = '';
  oldStatus = '';

  constructor(
    public router: Router,
    public chatService: ChatService,
    public userService: UserService,
    public onlineSocket: OnlineSocket
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
      let newRoute = this.router.url;
      let newStatus = '';
      if (newRoute != this.oldRoute) {
        this.oldRoute = newRoute;
        UserService.running = newRoute.indexOf('/log') != 0;
        if (newRoute.indexOf('/game/') == 0) newStatus = 'INGAME';
        else if (newRoute.indexOf('/chat') == 0) newStatus = 'INCHAT';
        else newStatus = 'ONLINE';
        if (newStatus != this.oldStatus) {
          this.oldStatus = newStatus;
          this.userService.setStatus(newStatus);
        }
      }
    });
  }
}
