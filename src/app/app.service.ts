import { Injectable } from '@angular/core';
import { LoggerService } from './services/logger.service';
import { RoleService } from './auth/roles/role.service';
import { AuthService } from './auth/auth.service';
import { AppStateService } from './services/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly context = 'AppService';

  constructor(
    private logger: LoggerService,
    private roleService: RoleService,
    private authService: AuthService,
    private appStateService: AppStateService
  ) {}

  initAppState() {
    this.logger.log(this.context, 'AppService funcionando');
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
    this.appStateService.setUserState(username);
  }

  setLoggedState(data: boolean, context?: string): void {
    this.appStateService.setLoggedState(data);
  }
}
