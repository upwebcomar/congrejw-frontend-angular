import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MicuentaComponent } from './micuenta/micuenta.component';
import { TableroanunciosComponent } from './views/tableroanuncios/tableroanuncios.component';
import { AdminComponent } from './components/admin/admin.component';
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { NotFoundComponent } from './views/not-found/not-found.component';


export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "home", component: HomeComponent },
    { path: "modal", component: ModalComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "micuenta", component: MicuentaComponent },
    { path: "tablero-anuncios", component: TableroanunciosComponent },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] },
    },
    { path: "unauthorized", component: UnauthorizedComponent },
    { path: '**', component: NotFoundComponent },
];
