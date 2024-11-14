import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private username = new BehaviorSubject<string>('Inicio Sesion');
  userState$: Observable<string> = this.username.asObservable();

  private logged = new BehaviorSubject<boolean>(false);
  logged$: Observable<boolean> = this.logged.asObservable();

  constructor(){console.log('Inicio AppStateService');
  }


  setUserState(username: string): void {
    this.username.next(username);
    console.log('Updated Username:', username);
  }

  setLoggedState(data: boolean): void {
    this.logged.next(data);
  }
}
