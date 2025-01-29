import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwt-payload.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Roles del usuario presentes en el payload del usuario
  private roles: string[] = []; // Propiedad para almacenar los roles

  constructor(private http: HttpClient) {
    const token = this.getToken(); // Intenta recuperar el token al iniciar
    if (token) {
      this.loadRolesFromToken(token); // Si hay token, carga los roles
    }
  }

  // Almacenar el token en localStorage
  storeToken(token: string): void {
    localStorage.setItem('access_token', token); // Almacena el token
    this.loadRolesFromToken(token); // Carga los roles desde el token
  }

  // Recuperar el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token'); // Recupera el token
  }

  // Cargar los roles desde el token JWT
  loadRolesFromToken(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token); // Decodifica el token
      this.roles = decodedToken.roles || []; // Asigna los roles desde el payload
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.roles = [];
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
