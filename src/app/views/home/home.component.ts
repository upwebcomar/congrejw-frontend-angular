import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AppStateService } from '../../services/app-state.service';
import { LoggerService } from '../../services/logger.service';

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
    private appState:AppStateService,
    private logger:LoggerService
  ){}
  ngOnInit(): void {

  }
}
