import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface RegisterDto {
  username: string;

  password: string;

  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(credentials: RegisterDto) {
    return this.http.post(`${this.apiUrl}/auth/register`, credentials);
  }
}
