import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarService } from './navbar.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AppStateService } from '../../services/app-state.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('login') login!: ElementRef<HTMLAnchorElement>;

  private loggedSubscription!: Subscription;
  loginLink:string ='login'
  isLogged:boolean = false

  constructor(
    private navbarService: NavbarService,
    private appState: AppStateService,
    private cdr: ChangeDetectorRef
  ) {}

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
   // Si al abrir la aplicacion hay un token valido actualizo el navbar en login
    this.loggedSubscription = this.appState.logged$.subscribe(data => {
      if(data){
        this.appState.userState$.subscribe(newText => {
          this.login.nativeElement.textContent = newText;
          this.loginLink = 'micuenta'
          })
        this.isLogged = data
        this.cdr.detectChanges(); // Forza la detección de cambios para evitar el error
      }else{
        this.login.nativeElement.textContent = 'Sesion';
        this.loginLink = 'login'
      }
    
  })
  }

  ngOnDestroy(): void {
    console.log('se destruye navbar');
    
    this.loggedSubscription.unsubscribe();
  }
}
