import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { LoggerService } from '../../../../services/logger.service';
import { RoleService } from '../../../../auth/roles/role.service';
import { AllUserDto, UsersService } from '../../../../services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'dashboard-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users!: AllUserDto[];
  roles: { id: number; rol: string; obs: string }[] = [];
  newRole: string = '';
  newObs: string = '';
  private context = 'UsersComponent';
  usersTabsClass: string[] = ['active'];
  rolesTabsClass: string[] = [];

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private roleService: RoleService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.loadRoles();
  }

  getUsers() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.logger.log(this.context, 'Usuarios cargados', data);
      },
      error: (error) => {
        this.logger.log(this.context, error);
      },
    });
  }

  loadRoles() {
    this.roleService.rolesOfApi().subscribe({
      next: (data: { id: number; rol: string; obs: string }[]) => {
        this.roles = data;
        console.log('Roles cargados:', this.roles);
      },
      error: (error: string) => {
        this.logger.log(this.context, error);
        console.error('Error al obtener roles:', error);
      },
    });
  }

  toggleRole(user: AllUserDto, role: string): void {
    const index = user.roles.indexOf(role);
    if (index > -1) {
      user.roles.splice(index, 1);
    } else {
      user.roles.push(role);
    }
  }

  updateUserRoles(userId: number, roles: string[]): void {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.roles = roles;
    }
  }

  saveChanges(): void {
    const payload = this.users.map((user) => ({
      id: user.id,
      roles: user.roles,
    }));

    this.http.put(environment.apiUrl + '/users/roles', payload).subscribe({
      next: (response) => {
        console.log(this.context, 'Roles actualizados con éxito:', response);
        alert('Roles actualizados correctamente');
      },
      error: (error) => {
        this.logger.log(this.context, 'Error al actualizar roles:', error);
        alert('Error al actualizar roles');
      },
    });
  }

  addRole() {
    if (
      this.newRole &&
      !this.roles.some((r) => r.rol === this.newRole.trim())
    ) {
      this.roleService
        .addRole({ rol: this.newRole.trim(), obs: this.newObs })
        .subscribe({
          next: (role) => {
            this.roles.push(role);
            this.newRole = '';
            this.newObs = '';
          },
          error: (error) => {
            this.logger.log(this.context, 'Error al agregar rol:', error);
          },
        });
    }
  }

  deleteRole(role: any) {
    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar el rol "${role.rol}"?`
    );
    if (confirmDelete) {
      this.roleService.removeRole(role.id).subscribe({
        next: () => {
          this.roles = this.roles.filter((r) => r.id !== role.id);
          this.users.forEach((user) => {
            user.roles = user.roles.filter((r) => r !== role.rol);
          });
        },
        error: (error) => {
          this.logger.log(this.context, 'Error al eliminar rol:', error);
        },
      });
    }
  }

  usersTabsClick() {
    this.usersTabsClass = ['active'];
    this.rolesTabsClass = [];
  }

  rolesTabsClick() {
    this.rolesTabsClass = ['active'];
    this.usersTabsClass = [];
  }
}
