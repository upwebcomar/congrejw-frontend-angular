import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../components/navbar/navbar.service';
import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styles: [''],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private navbarService: NavbarService,
    private appstate: AppStateService,
    private cdr: ChangeDetectorRef
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
 
    
    this.http.post<{ access_token: string }>('http://localhost:3000/auth/login', { username, password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);

          this.appstate.setUserState(username)
          this.appstate.setLoggedState(true)
          this.navbarService.updateLoginHref('micuenta')
          this.cdr.detectChanges()
          console.log(username);
          
          this.router.navigate(['/']); // Redirigir a la página principal o a donde quieras
        },
        error: error => {
          this.error = 'Error de inicio de sesión '+ error;
          this.loading = false;
          this.cdr.detectChanges()
        }
      });
  }
}

