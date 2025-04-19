import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../auth/roles/role.service';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private context = 'LoginService';
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private appState: AppStateService
  ) {}

  loginSuccess(token: string) {
    this.authService.saveToken(token); // Salvo el token
    if (this.authService.isTokenValid()) {
      this.roleService.loadRolesFromToken(); // Recargo roles en memoria
      this.appState.setLoggedState(true);
    } else {
      throw new Error(`${this.context}:token invalido`);
    }
  }
}
