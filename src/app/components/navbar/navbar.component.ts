import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavbarService } from './navbar.service';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AppStateService } from '../../services/app-state.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('login') login!: ElementRef<HTMLAnchorElement>;
  private loginTxextSubscription!: Subscription;
  private loginHrefSubscription!: Subscription;
  loginLink:string ='login'

  constructor(
    private navbarService: NavbarService,
    private appState: AppStateService
  ) {}

  ngAfterViewInit(): void {
    this.loginTxextSubscription = this.appState.userState$.subscribe(newText => {
      this.login.nativeElement.textContent = newText;
      
    });
    this.loginHrefSubscription = this.navbarService.loginHref$.subscribe(path => {
      this.loginLink = path;
      
    });

  }

  ngOnDestroy(): void {
    console.log('se destruye navbar');
    
    this.loginTxextSubscription.unsubscribe(); // Limpiar la suscripción
    this.loginHrefSubscription.unsubscribe(); // Limpiar la suscripción

  }
}
