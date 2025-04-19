import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwt-payload.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Roles del usuario presentes en el payload del usuario
  private context = 'RoleService';
  private roles: string[] = []; // Propiedad para almacenar los roles

  constructor(
    private http: HttpClient,
    private authSevice: AuthService,
    private logger: LoggerService
  ) {
    const token = this.getToken(); // Intenta recuperar el token al iniciar
    if (token) {
      this.loadRolesFromToken(); // Si hay token, carga los roles
    }
  }

  // Recuperar el token desde localStorage
  private getToken(): string | null {
    return this.authSevice.getToken();
  }
  // Cargar los roles desde el token JWT
  loadRolesFromToken(): void {
    const token = this.authSevice.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodifica el token
        this.roles = decodedToken.roles || []; // Asigna los roles desde el payload
      } catch (error) {
        this.logger.error(
          this.context,
          'Error al decodificar el token:',
          error
        );
        this.roles = [];
      }
    } else {
      this.logger.error(this.context, 'Error: No hay token');
    }
  }
  // Cargar la data desde el token JWT
  loadDataFromToken(token: string): JwtPayload | undefined {
    try {
      const decodedToken: any = jwtDecode(token); // Decodifica el token
      return decodedToken;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return;
    }
  }

  // Obtiene los roles cargados
  getRoles(): string[] {
    return this.roles;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  // Verifica si el usuario tiene al menos uno de los roles proporcionados
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }

  // Verifica si el usuario tiene todos los roles proporcionados
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.roles.includes(role));
  }

  // Limpia los roles, generalmente al cerrar sesión
  clearRoles(): void {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento
    this.roles = []; // Limpia los roles
  }

  rolesOfApi(): Observable<{ id: number; rol: string; obs: string }[]> {
    return this.http.get<{ id: number; rol: string; obs: string }[]>(
      environment.apiUrl + '/roles'
    );
  }

  addRole(payload: {
    rol: string;
    obs: string;
  }): Observable<{ id: number; rol: string; obs: string }> {
    return this.http.post<{ id: number; rol: string; obs: string }>(
      environment.apiUrl + '/roles',
      { rol: payload.rol, obs: payload.obs }
    );
  }
  removeRole(id: number) {
    return this.http.delete<{ id: number; rol: string; obs: string }>(
      `${environment.apiUrl}/roles/${id}`
    );
  }
}
