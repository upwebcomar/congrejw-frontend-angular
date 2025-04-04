import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface AllUserDto {
  id: number;
  username: string;
  roles: string[]; // Roles asignados al usuario
  email: string;
}
export interface UserProfile {
  name: string;
  email: string;
  image: string;
  phone: string;
  address: string;
  profile: Profile;
}
export interface Profile {
  name: string;
  email: string;
  image: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  [x: string]: any;
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<AllUserDto[]> {
    return this.http.get<AllUserDto[]>(environment.apiUrl + '/users');
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/${userId}`);
  }

  getProfileImage(image: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.get(environment.apiUrl + '/files/image-profile/' + image, {
      headers,
      responseType: 'blob',
    });
  }
  saveProfile(userId: number, UserProfile: UserProfile) {
    return this.http.put<UserProfile>(
      `${environment.apiUrl}/profiles/${userId}`,
      UserProfile
    );
  }
}
