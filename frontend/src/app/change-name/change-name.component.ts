import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent {
  userName = 'John'; // set default user name
  showForm = false;
  newName = '';

  constructor(private http: HttpClient) {}

  submitName() {
    // Make HTTP request to update the user's name
    this.http.post('/api/update-name', { name: this.newName }).subscribe(
      response => {
        this.userName = this.newName; // update user name on success
        this.newName = ''; // clear input field
        this.showForm = false; // hide form
      },
      error => {
        console.log('Error updating name:', error); // log error message
        alert('Error updating name: ' + error.error.message); // show error message
      }
    );
  }
}