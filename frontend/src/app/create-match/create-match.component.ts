import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.css'],
})
export class CreateMatchComponent implements OnInit {
  constructor(private userService: UserService) {}
  enhancedMode = false;
  randomOpponent = false;
  waitingForMatch = false;
  switchGameMode() {
    this.enhancedMode = !this.enhancedMode;
  }
  setRandomOpponent() {
    this.randomOpponent = true;
  }
  unsetRandomOpponent() {
    this.randomOpponent = false;
  }
  availableUsers: User[] = [];
  ngOnInit() {
    this.getAvailableUsers();
  }
  getAvailableUsers() {
    this.userService
      .getAvailableUsers()
      .subscribe(users => (this.availableUsers = users));
  }
  submitMatch() {
    this.waitingForMatch = true;
    // TODO: Actually send request to the server.
  }
  cancelMatchWait() {
    this.waitingForMatch = false;
    // TODO: Actually cancel the call.
  }
}
