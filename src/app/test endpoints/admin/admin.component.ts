import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    imports: [CommonModule],
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styles: ''
})
export class AdminComponent {
  loading = false;
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  accessAdmin() {
    this.loading = true;
    this.message = '';

    // Simula el acceso al backend para validar el token
    this.http.get(`${environment.apiUrl}/admin`, { responseType: 'text' }).subscribe(
      (response) => {
        this.loading = false;
        this.message = `Access granted: ${response}`;
        //this.router.navigate(['/admin']); // Navega a la página de admin
      },
      (error) => {
        this.loading = false;
        this.message = 'Access denied. You are not authorized!';
        console.error('Error:', error);
      }
    );
  }
}
