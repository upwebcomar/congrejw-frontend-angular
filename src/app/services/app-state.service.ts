import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { RoleService } from '../auth/roles/role.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private readonly context = 'AppStateService';

  private username = new BehaviorSubject<string>('Sesión');
  userState$: Observable<string> = this.username.asObservable();

  private logged = new BehaviorSubject<boolean>(false);
  logged$: Observable<boolean> = this.logged.asObservable();

  constructor(
    private logger: LoggerService,
    private roleService: RoleService,
    private authService: AuthService
  ) {
    this.logger.log(this.context, 'AppStateService funcionando');
    const token = this.authService.getToken();
    if (token && this.authService.isTokenValid()) {
      const payload = this.roleService.loadDataFromToken(token);
      if (payload != undefined) {
        this.setUserState(payload.username);
        this.setLoggedState(true);
        this.logger.log(this.context, 'Token valido');
      }
    } else {
      this.logger.log(this.context, 'Token no valido');
    }
  }

  setUserState(username: string): void {
    this.username.next(username);
  }

  setLoggedState(data: boolean, context?: string): void {
    this.logged.next(data);
  }
}
