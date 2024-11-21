import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterDto } from './dto/register.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  register(credentials:RegisterDto) {
    return this.http.post(`${this.apiUrl}/auth/register`, credentials)
  }
}
