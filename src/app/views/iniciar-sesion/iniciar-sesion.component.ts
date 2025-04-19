import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { LoginGoogleComponent } from './login-google/login-google.component';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, LoginComponent, LoginGoogleComponent],
  templateUrl: './iniciar-sesion.component.html',
  styles: ``,
})
export class IniciarSesionComponent {}
