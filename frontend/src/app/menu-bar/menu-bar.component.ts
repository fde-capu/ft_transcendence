import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
})
export class MenuBarComponent implements OnInit {
  user?: User;

  menuOpen = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getLoggedUser().subscribe(backUser => {
      this.user = backUser;
    });
  }

  onClickBurger(): void {
    this.menuOpen = !this.menuOpen;
  }

  menuOff(): void {
    this.menuOpen = false;
  }
}
