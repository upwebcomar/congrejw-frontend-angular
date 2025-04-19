import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { RegisterService } from '../../services/register.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule], // Importaciones necesarias para un componente standalone
  providers: [AuthService, LoggerService],
  templateUrl: './register.component.html',
  styles: '',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup<{
    username: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  loading: boolean = false; //Muestra el spinner
  error: string = ''; // Mensaje de error

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: this.fb.nonNullable.control<string>('', Validators.required),
        email: this.fb.nonNullable.control<string>('', [
          Validators.required,
          Validators.email,
        ]),
        password: this.fb.nonNullable.control<string>('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: this.fb.nonNullable.control<string>('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  // Validación personalizada para que las contraseñas coincidan
  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { notSame: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true; // muestra spinner
    try {
      await firstValueFrom(
        this.registerService.register(this.registerForm.getRawValue()) // Envia credenciales a la API
      );
      this.logger.log('RegisterComponent', 'Registro exitoso');
      this.loading = false;
      this.router.navigate(['/login']);
    } catch (error) {
      this.logger.error('RegisterComponent', 'Error en el registro', error);
      this.loading = false; // hide spinner
      this.error = 'Error al registrar, intenta nuevamente';
    }
  }
}
