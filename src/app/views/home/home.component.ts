  import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
  import { NavbarComponent } from '../../components/navbar/navbar.component';
  import { AppStateService } from '../../services/app-state.service';
  import { LoggerService } from '../../services/logger.service';
import { NavbarService } from '../../components/navbar/navbar.service';

  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavbarComponent],
  templateUrl:'./home.component.html',
    styles: ``
  })
  export class HomeComponent implements OnInit {
    private readonly context = 'HomeComponent';
    
    constructor(
      private navbarService: NavbarService,
      private logger:LoggerService,

    ){}
    ngOnInit(): void {
      // Al iniciar debe actualizar el Navbar por si logincomponent actualiza el estado o por si se cerro sesion
      this.navbarService.actualizarNavbar()
     
    }
    
    
  }
