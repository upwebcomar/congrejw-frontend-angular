import { Routes } from '@angular/router';
import { IniciarSesionComponent } from '../views/iniciar-sesion/iniciar-sesion.component';
import { LoginSuccessComponent } from '../views/iniciar-sesion/login-success/login-success.component';

export const loginRoutes: Routes = [
  {
    path: 'login',
    component: IniciarSesionComponent,
  },
  {
    path: 'login-success',
    component: LoginSuccessComponent,
  },
];
