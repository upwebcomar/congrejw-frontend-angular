import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { NavbarService } from './navbar.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AppStateService } from '../../services/app-state.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../auth/roles/role.service';
import { LoggerService } from '../../services/logger.service';
import { NotificationComponent } from '../../views/notifications/notification.component';
import { NotificationService } from '../../services/notifications/notification.service';
import { Notification } from '../../views/notifications/notification.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule,NotificationComponent],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('login') login!: ElementRef<HTMLAnchorElement>;

  private loggedSubscription!: Subscription;
  private actualizaNavBarSubscription!: Subscription;
  loginLink: string = 'login';
  isLogged: boolean = false;
  isTieneRolPermitido: boolean = false
  roles!: string[];
  private context:string = 'NavbarComponent'
  notifications!:Notification[]
 

  // Roles permitidos para cada acción
  rolesPermitidos = {
    editor: ['admin', 'editor'], // Roles permitidos para agregar un anuncio
    user: ['admin', 'user'],  // Roles permitidos para editar un anuncio
    admin: ['admin'], // Roles permitidos para borrar un anuncio
  };
  notiVisibilitySubs: BehaviorSubject<boolean>;

  constructor(
    private navbarService: NavbarService,
    private appState: AppStateService,
    private cdr: ChangeDetectorRef,
    private rolesService: RoleService,
    private logger: LoggerService,
    private notificationsService: NotificationService,
    
  ) {
    // Estado de las notificaciones
    this.notiVisibilitySubs = this.notificationsService.notifyVisibility
    this.notificationsService.notifications$.subscribe(value=>{this.notifications = value})
  }


  /* 
    Cuando sea necesario conservar el estado de navbarcomponent al navegar directamente en las rutas del navegador
      implementar un NavbarStateResolver y utilizar resolve en la ruta
      {
        path: 'some-path',
        component: NavbarComponent,
        resolve: {
          navbarState: NavbarStateResolver
        }
  */

  ngAfterViewInit(): void {
    this.actualizarNavbar();
    this.actualizaNavBarSubscription = this.navbarService.actualizarNavbar$.subscribe(() => {
      this.actualizarNavbar();
    });
  }
  // Métodos para verificar los roles permitidos
  tieneRolPermitido(accion: 'editor' | 'user' | 'admin'): boolean {
    this.roles = this.rolesService.getRoles(); // Cargo los roles del usuario
    const value = this.roles.some((role) => this.rolesPermitidos[accion].includes(role));
    return value
  }
  actualizarNavbar() {
    // Si al abrir la aplicacion hay un token valido actualizo el navbar en login
    this.loggedSubscription = this.appState.logged$.subscribe(data => {


      if (data) {
        // actualizo link micuenta
        this.appState.userState$.subscribe(newText => {
          this.login.nativeElement.textContent = newText;
          this.loginLink = 'micuenta'
        })
        this.isLogged = data;
        this.isTieneRolPermitido = this.tieneRolPermitido('admin')
        this.cdr.detectChanges(); // Forza la detección de cambios para evitar el error
      } else {
        this.isLogged = data
        this.isTieneRolPermitido = this.tieneRolPermitido('admin')
        this.login.nativeElement.textContent = 'Loguear';
        this.loginLink = 'login';
        this.cdr.detectChanges(); // Forza la detección de cambios para evitar el error
      }

    })
  }

  toggleNotify(event: Event): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    this.notiVisibilitySubs.next(true)
  }

  ngOnDestroy(): void {
    this.loggedSubscription.unsubscribe();
  }
}
