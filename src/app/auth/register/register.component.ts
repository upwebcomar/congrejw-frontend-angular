import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, CommonModule], // Importaciones necesarias para un componente standalone
    providers: [AuthService, LoggerService],
    templateUrl: './register.component.html',
    styles: ''
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router:Router,
    private logger:LoggerService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordsMatchValidator });
  }

  // Validación personalizada para que las contraseñas coincidan
  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { notSame: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authservice.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.logger.log('RegisterComponent','Registro exitoso', response);
        this.loading = false;
        this.router.navigate(['/login'])
      },
      error: (err) => {
        this.logger.error('RegisterComponent','Error en el registro', err);
        this.loading = false;
        this.error = 'Error al registrar, intenta nuevamente';
      }
    });
  }
}
