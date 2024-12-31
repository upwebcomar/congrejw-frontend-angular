import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TableroanunciosComponent } from './views/tableroanuncios/tableroanuncios.component';
import { AdminComponent } from './test endpoints/admin/admin.component';
import { RoleGuard } from './auth/guards/role.guard';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { PdfPreviewComponent } from './views/pdf-preview/pdf-preview.component';
import { CrearAnuncioComponent } from './views/tableroanuncios/forms/crear-anuncio.component';
import { EditarAnuncioComponent } from './views/tableroanuncios/forms/editar-anuncio.component';
import { FilesManagerComponent } from './views/files/files-manager.component';
import { gruposServiciodelcampoComponent } from './views/grupos-serviciodelcampo/grupos-serviciodelcampo.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MicuentaComponent } from './views/micuenta/micuenta.component';
import { ConfiguracionComponent } from './views/configuracion/configuracion.component';


export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "home", component: HomeComponent },
    { path: "modal", component: ModalComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "micuenta",
        component: MicuentaComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['user'] },
    },
    {
        path: "tablero-anuncios",
        component: TableroanunciosComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['user'] },
    },
    {
        path: "tablero-anuncios/crear-anuncio",
        component: CrearAnuncioComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['admin','user'] },
    },
    {
        path: "tablero-anuncios/editar-anuncio/:id",
        component: EditarAnuncioComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['admin','user'] },
    },
    {
        path: "pdf-preview",
        component: PdfPreviewComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['user'] },
        
    },
    {
        path: "grupos-servicio-campo",
        component: gruposServiciodelcampoComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['user'] },
        
    },
    {
        path: "config",
        component: ConfiguracionComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['admin','user'] },
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['admin'] },
    },
    {
        path: "files-manager",
        component: FilesManagerComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['admin','user'] },
    },


    // Endpoints de prueba
    {
        path: 'test/admin',
        component: AdminComponent,
        canActivate: [AuthGuard,RoleGuard],
        data: { roles: ['admin'] },
    },




    // deben estar al final
    { path: "unauthorized", component: UnauthorizedComponent },
    { path: '**', component: NotFoundComponent },
];
