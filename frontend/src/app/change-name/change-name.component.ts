import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HelperFunctionsService } from '../helper-functions.service';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css'],
})
export class ChangeNameComponent {
  @Input() userName!: string; // set default user name
  showForm = false;
  newName = '';
  errorMessage = '';

  constructor(
		private http: HttpClient,
		private fun: HelperFunctionsService
	) {}

  submitName() {
		this.fun.blink('okButton');
    // Make HTTP request to update the user's name
    let name: string = this.newName;

    name = name.trim();
    const data = { name };
    const options = { withCredentials: true }; // set withCredentials to true
    this.http
      .put<any>(`${environment.BACKEND_ORIGIN}/user/update-name`, data, options)
      .subscribe(
        response => {
          this.userName = response.name; // update user name on success
          this.newName = ''; // clear input field
          this.showForm = false; // hide form
          this.errorMessage = ''; // clear error message
        },
        (error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side error occurred
            this.errorMessage = `Invalid: ${error.error.message}`;
          } else {
            // Server-side error occurred
            this.errorMessage = `Invalid: $${error.error.error}`;
          }
        }
      );
  }

  hideErrorMessage() {
    this.errorMessage = '';
  }
}
