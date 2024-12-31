import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../components/navbar/navbar.service';
import { AppStateService } from '../../services/app-state.service';
import { environment } from '../../../environments/environment';
import { RoleService } from '../roles/role.service';
import { LoggerService } from '../../services/logger.service';


@Component({
  selector: 'app-login',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styles: [''],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  private context:string = 'LoginComponent'


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private navbarService: NavbarService,
    private appstate: AppStateService,
    private cdr: ChangeDetectorRef,
    private roleService:RoleService,
    private logger:LoggerService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;
 
    
    this.http.post<{ access_token: string }>(`${environment.apiUrl}/auth/login`, { username, password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);

          this.appstate.setUserState(username,this.context)
          this.appstate.setLoggedState(true,this.context)
          this.navbarService.updateLoginHref('micuenta')
          this.cdr.detectChanges()

                    // Carga los roles desde el token JWT
          this.roleService.loadRolesFromToken(response.access_token);

          // Opcional: Verifica los roles del usuario
          this.logger.log(this.context,'Roles cargados:', this.roleService.getRoles());
          
          this.router.navigate(['/home']); // Redirigir a la página principal o a donde quieras
        },
        error: error => {
          this.error = 'Error de inicio de sesión '+ error;
          this.logger.log(this.context,this.error)
          this.loading = false;
          this.cdr.detectChanges()
        }
      });
  }
}

