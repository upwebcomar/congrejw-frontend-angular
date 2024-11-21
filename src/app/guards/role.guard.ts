import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private roleService: RoleService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data['roles'] as string[]; // Accede a los roles desde `data`
    
    if (this.roleService.hasAnyRole(roles)) {
      return true;
    }

    // Si el usuario no tiene el rol necesario, redirige a otra página (por ejemplo, acceso denegado)
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
