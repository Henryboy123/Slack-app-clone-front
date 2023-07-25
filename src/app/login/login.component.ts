import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    const backendUrl = 'http://localhost:3000/api/users/signin';

    this.http.post<any>(backendUrl, loginData).subscribe(
      (response) => {
        console.log('Response from the server:', response);

        if (response.token) {
          this.saveDataToLocalStorage(response);
          this.router.navigate(['/dashboard']);
        } else {
          console.log("Login unsuccessful");
        }
      },
      (error) => {
        console.error('Error sending the request:', error);
      }
    );
  }

  private saveDataToLocalStorage(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('responseId', response.id);
    localStorage.setItem('name', response.name);
  }
}
