import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  /**
   * Almacena el texto del enlace de login en la navbar.
   * Se inicializa con '-' y puede cambiar dinámicamente.
   */
  private loginTextSource = new BehaviorSubject<string>('-');

  /**
   * Almacena la ruta del enlace de login en la navbar.
   * Se inicializa con 'login' y puede cambiar dinámicamente.
   */
  private loginHrefSource = new BehaviorSubject<string>('login');

  /**
   * Sujeto que emite eventos cuando se requiere actualizar la navbar.
   */
  private actualizaNavbar = new Subject<void>();

  /**
   * Observable que expone el texto del enlace de login.
   */
  loginText$ = this.loginTextSource.asObservable();

  /**
   * Observable que expone la ruta del enlace de login.
   */
  loginHref$ = this.loginHrefSource.asObservable();

  /**
   * Observable que notifica cuando la navbar debe actualizarse.
   */
  actualizarNavbar$ = this.actualizaNavbar.asObservable();

  /**
   * Actualiza el texto del enlace de login en la navbar.
   * @param newText El nuevo texto para el enlace de login.
   */
  updateLoginText(newText: string) {
    this.loginTextSource.next(newText);
  }

  /**
   * Actualiza la ruta del enlace de login en la navbar.
   * @param path La nueva ruta para el enlace de login.
   */
  updateLoginHref(path: string) {
    this.loginHrefSource.next(path);
  }

  /**
   * Notifica a los suscriptores que la navbar debe actualizarse.
   * Útil cuando cambia el estado del usuario (ej. login/logout).
   */
  actualizarNavbar() {
    this.actualizaNavbar.next();
  }
}
