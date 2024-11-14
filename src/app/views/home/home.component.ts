import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AppStateService } from '../../app-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
 templateUrl:'./home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  constructor(
    private appState:AppStateService
  ){}
  ngOnInit(): void {
    this.appState.userState$.subscribe(data => console.log(data));
    
    
  }
}
