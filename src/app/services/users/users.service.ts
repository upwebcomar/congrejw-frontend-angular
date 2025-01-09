import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AllUserDto } from './all-users.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<AllUserDto[]> {
    return this.http.get<AllUserDto[]>(environment.apiUrl + '/users')
  }
}
