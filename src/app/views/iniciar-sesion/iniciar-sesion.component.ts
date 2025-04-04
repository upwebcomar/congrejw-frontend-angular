import { Component } from '@angular/core';
import { LoginComponent } from '../../auth/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './iniciar-sesion.component.html',
  styles: ``,
})
export class IniciarSesionComponent {}
