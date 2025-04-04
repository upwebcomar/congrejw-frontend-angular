import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { NavbarService } from './navbar.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AppStateService } from '../../services/app-state.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../auth/roles/role.service';
import { LoggerService } from '../../services/logger.service';
import { NotificationComponent } from '../../views/notifications/notification.component';
import {
  Notification,
  NotificationService,
} from '../../services/notification.service';
import { AuthService } from '../../auth/auth.service';
import { MicuentaComponent } from '../../views/micuenta/micuenta.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, NotificationComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit {
  userLogued: string = 'Loguear';
  isLogged: boolean = false;
  roles!: string[];
  private context: string = 'NavbarComponent';
  notifications!: Notification[];
  @ViewChild('submenu') submenu!: ElementRef;

  notiVisibilitySubs: BehaviorSubject<boolean>;

  constructor(
    private navbarService: NavbarService,
    private appState: AppStateService,
    private cdr: ChangeDetectorRef,
    private rolesService: RoleService,
    private authService: AuthService,
    private logger: LoggerService,
    private notificationsService: NotificationService,
    private renderer: Renderer2
  ) {
    // Estado de las notificaciones
    this.notiVisibilitySubs = this.notificationsService.notifyVisibility;
    this.notificationsService.notifications$.subscribe((value) => {
      this.notifications = value;
    });
    this.notificationsService.getNotifications();
  }

  ngAfterViewInit(): void {
    this.actualizarNavbar();
  }
  // Métodos para verificar los roles permitidos
  isTieneRolPermitido(accion: string[]): boolean {
    return this.rolesService.hasAnyRole(accion);
  }
  actualizarNavbar() {
    // Si al abrir la aplicacion hay un token valido actualizo el navbar en login
    this.appState.logged$.subscribe((data) => {
      if (data) {
        this.userLogued = this.authService.getUsername();
        this.isLogged = data;
        this.cdr.detectChanges(); // Forza la detección de cambios para evitar el error
      } else {
        this.isLogged = data;
        this.cdr.detectChanges(); // Forza la detección de cambios para evitar el error
      }
    });
  }

  toggleNotify(event: Event): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    this.notiVisibilitySubs.next(true);
  }

  toggleSubmenu(event: Event) {
    event.preventDefault();

    // Verificar si el submenú existe
    if (this.submenu) {
      const isShow = this.submenu.nativeElement.classList.contains('show');

      // Si el submenú no estaba abierto, abrirlo
      if (isShow) {
        this.renderer.removeClass(this.submenu.nativeElement, 'show');
      } else {
        this.renderer.addClass(this.submenu.nativeElement, 'show');
      }
    }
  }

  private closeAllSubmenus() {
    const openMenus = document.querySelectorAll('.dropdown-menu.show');
    openMenus.forEach((menu) => this.renderer.removeClass(menu, 'show'));
  }
}
