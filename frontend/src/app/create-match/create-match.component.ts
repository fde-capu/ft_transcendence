import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.css'],
})
export class CreateMatchComponent implements OnInit {
  enhancedMode = false;
  randomOpponent = false;
  waitingForMatch = false;
  availableUsers: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getAvailableUsers();
  }

  switchGameMode() {
    this.enhancedMode = !this.enhancedMode;
  }

  setRandomOpponent() {
    this.randomOpponent = true;
  }

  unsetRandomOpponent() {
    this.randomOpponent = false;
  }

  getAvailableUsers() {
		this.availableUsers = this.userService.getAvailableUsers();
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
