import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styles: ''
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.email]]  // Validación personalizada
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    
    // Lógica de envío del formulario
    this.loading = true;
    // Realizar registro...
  }
}

