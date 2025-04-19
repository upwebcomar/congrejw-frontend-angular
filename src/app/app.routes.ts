import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { RegisterComponent } from './views/register/register.component';
import { AdminComponent } from './test endpoints/admin/admin.component';
import { RoleGuard } from './auth/guards/role.guard';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { FilePreviewComponent } from './views/pdf-preview/file-preview.component';
import { gruposServiciodelcampoComponent } from './views/grupos-serviciodelcampo/grupos-serviciodelcampo.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MicuentaComponent } from './views/micuenta/micuenta.component';
import { ConfiguracionComponent } from './views/configuracion/configuracion.component';
import { NotificationComponent } from './views/notifications/notification.component';
import { BooksGridComponent } from './views/lectura-biblia/books-grid.component';
import { ChatWebsocketComponent } from './components/chatwebsocket/chat-websocket.component';
import { IniciarSesionComponent } from './views/iniciar-sesion/iniciar-sesion.component';
import { tableroAnunciosRoutes } from './routes/tablero-anuncios.routes';
import { loginRoutes } from './routes/login.routes';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'modal', component: ModalComponent },
  ...loginRoutes,
  { path: 'register', component: RegisterComponent },
  {
    path: 'micuenta',
    component: MicuentaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },

  {
    path: 'pdf-preview',
    component: FilePreviewComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'grupos-servicio-campo',
    component: gruposServiciodelcampoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'config',
    component: ConfiguracionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'notifications',
    component: NotificationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'user'] },
  },
  {
    path: 'mi-lectura-biblia',
    component: BooksGridComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },

  // Endpoints de prueba
  {
    path: 'test/admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  // Endpoints de prueba
  {
    path: 'chatwebsocket',
    component: ChatWebsocketComponent,
  },

  ...tableroAnunciosRoutes,

  // deben estar al final
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent },
];
