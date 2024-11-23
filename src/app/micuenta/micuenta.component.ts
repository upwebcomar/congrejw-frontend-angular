import { Component, OnDestroy, OnInit } from '@angular/core';
;
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-micuenta',
  standalone: true,
  imports: [],
  templateUrl: './micuenta.component.html',
  styles: ``
})
export class MicuentaComponent implements OnInit, OnDestroy {
  constructor(
    private appState: AppStateService
  ) {}

  ngOnInit(): void {

  }
  
  ngOnDestroy(): void {
  }
}
