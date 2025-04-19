import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [],
  templateUrl: './login-google.component.html',
  styles: ``,
})
export class LoginGoogleComponent implements OnInit {
  private apiUrl = window.env?.['apiUrl'] || 'http://localhost:3000';

  ngOnInit(): void {
    console.log(this.apiUrl);
  }

  // login.component.ts
  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }
  /**
  loginWithGoogle() {
    window.location.href = `${
      this.apiUrl
    }/auth/google?redirectUri=${encodeURIComponent(
      window.location.origin + '/login-success'
    )}`;
  } 
    */
}
