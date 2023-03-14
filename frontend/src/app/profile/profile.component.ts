import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user?: User;

  displayUser?: User;

  idRequest!: string;

  owner = false;

  profileType = 'USER';

  isFriend = false;

  constructor(
    private userService: UserService,
    public fun: HelperFunctionsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getLoggedUser().subscribe(backUser => {
      this.user = backUser;
      this.getIdRequest();
    });
  }

  getIdRequest() {
    this.route.params.subscribe((params: Params) => {
      this.idRequest = params['intraId'];
      this.getDisplayUser();
    });
  }

  getDisplayUser() {
    if (!this.idRequest) {
      this.displayUser = this.user;
      this.setOwnership();
      return;
    }
    this.userService.getUserById(this.idRequest).subscribe(backUser => {
      if (backUser) this.displayUser = backUser;
      else this.displayUser = undefined;
      // ^ Above seems redundant but condition is needed.
      this.setOwnership();
    });
  }

  async setOwnership() {
    if (!this.user) return;
    this.isFriend = this.userService.isFriend(this.displayUser);
    this.owner = this.user.intraId == this.displayUser?.intraId;
    this.profileType = this.owner ? 'YOUR' : this.isFriend ? 'FRIEND' : 'USER';
  }

  saveUser() {
    if (this.displayUser)
      this.userService.saveUser(this.displayUser).subscribe();
  }

  switchMfa() {
    if (this.displayUser)
      this.displayUser.mfa_enabled = !this.displayUser.mfa_enabled;
    this.saveUser();
  }
}
