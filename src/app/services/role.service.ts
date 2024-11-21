import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  // Esta propiedad almacena los roles del usuario
  private roles: string[] = [];

  constructor() {}

  // Establece los roles del usuario, típicamente después de un login exitoso
  setRoles(roles: string[]): void {
    this.roles = roles;
  }

  // Obtiene los roles del usuario
  getRoles(): string[] {
    return this.roles;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  // Verifica si el usuario tiene al menos uno de los roles proporcionados
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.roles.includes(role));
  }

  // Verifica si el usuario tiene todos los roles proporcionados
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.roles.includes(role));
  }

  // Limpia los roles, generalmente al cerrar sesión
  clearRoles(): void {
    this.roles = [];
  }
}
