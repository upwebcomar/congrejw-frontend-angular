import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from './jwt-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/auth/login`,
      credentials
    );
  }

  getToken() {
    if (this.isTokenValid()) {
      return this.getTokenSaveInStorage();
    } else {
      return null;
    }
  }
  private getTokenSaveInStorage() {
    const token = localStorage.getItem('access_token');
    return token;
  }

  isTokenValid(): boolean {
    const token = this.getTokenSaveInStorage();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > now;
    } catch {
      return false;
    }
  }

  logout() {
    this.removeToken();
    //this.appState.setLoggedState(false);
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }
  removeToken() {
    localStorage.removeItem('access_token');
  }

  // Cargar la data desde el token JWT
  loadDataFromToken(token: string): JwtPayload {
    const decodedToken: any = jwtDecode(token); // Decodifica el token
    return decodedToken;
  }

  getUserId(): number {
    const token = this.getToken();
    if (token !== null) {
      const payload = this.loadDataFromToken(token);
      const userId = payload?.userId;
      return userId ? userId : 0;
    }
    return 0;
  }

  getUsername(): string {
    const username = '';
    const token = this.getToken();
    if (token !== null) {
      const payload = this.loadDataFromToken(token);
      return payload.username;
    }
    return username;
  }
}
