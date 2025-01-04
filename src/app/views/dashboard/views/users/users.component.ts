import { Component, OnInit } from '@angular/core';
import { AllUserDto } from './all-users.dto';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { LoggerService } from '../../../../services/logger.service';

@Component({
    imports: [CommonModule],
    standalone: true,
    selector: 'dashboard-users',
    templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
    users!: AllUserDto[]

    roles = ['admin', 'user', 'editor'];
    private context = 'UsersComponent'

    constructor(private http: HttpClient, private logger:LoggerService){

    }
    ngOnInit(): void {
        this.getUsers()
    }

    

    getUsers(){
        this.http.get<AllUserDto[]>(environment.apiUrl+'/users').subscribe({
                next:data=>{
                    this.users = data
                    console.log(this.context,'Usuarios',data);
                    
                },
                error:error=>{this.logger.log(this.context,error);
                }
            }
        )
    }

    toggleRole(user: AllUserDto, role: string): void {
        const index = user.roles.indexOf(role);
        if (index > -1) {
          user.roles.splice(index, 1); // Elimina el rol si ya está asignado
        } else {
          user.roles.push(role); // Agrega el rol si no está asignado
        }
        this.updateUserRoles(user.id, user.roles);
        console.log(this.users);
        
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

}
