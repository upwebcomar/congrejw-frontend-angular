import { Routes } from '@angular/router';
import { TableroanunciosComponent } from '../views/tableroanuncios/tableroanuncios.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CrearAnuncioComponent } from '../views/tableroanuncios/forms/crear-anuncio.component';
import { EditarAnuncioComponent } from '../views/tableroanuncios/forms/editar-anuncio.component';

export const tableroAnunciosRoutes: Routes = [
  {
    path: 'tablero-anuncios',
    component: TableroanunciosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'tablero-anuncios/crear-anuncio',
    component: CrearAnuncioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] },
  },
  {
    path: 'tablero-anuncios/editar-anuncio/:id',
    component: EditarAnuncioComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] },
  },
];
