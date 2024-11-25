import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MicuentaComponent } from './micuenta/micuenta.component';
import { TableroanunciosComponent } from './views/tableroanuncios/tableroanuncios.component';
import { AdminComponent } from './test endpoints/admin/admin.component';
import { RoleGuard } from './auth/roles/role.guard';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { NotFoundComponent } from './views/not-found/not-found.component';


export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "home", component: HomeComponent },
    { path: "modal", component: ModalComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "micuenta",
        component: MicuentaComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin','user'] },
    },
    {
        path: "tablero-anuncios",
        component: TableroanunciosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['user'] },
    },


    // Endpoints de prueba
    {
        path: 'test/admin',
        component: AdminComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] },
    },




    // deben estar al final
    { path: "unauthorized", component: UnauthorizedComponent },
    { path: '**', component: NotFoundComponent },
];
