import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NavbarService } from '../components/navbar/navbar.service';
import { AppStateService } from '../app-state.service';

@Component({
  selector: 'app-micuenta',
  standalone: true,
  imports: [],
  templateUrl: './micuenta.component.html',
  styles: ``
})
export class MicuentaComponent implements OnInit, OnDestroy {
  userStatus$!: Observable<{ username: string; logged: boolean }>;
  username:string = ''
  constructor(
    private navbarService: NavbarService,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {

   
    // Suscribirse al observable combinado para ver los valores en tiempo real
    this.appState.userState$.subscribe((data) => {
      this.username = data
      console.log(data);
    })
  }
  ngOnDestroy(): void {
    console.log('MicuentaComponent ngOnDestroy');
  }
}
