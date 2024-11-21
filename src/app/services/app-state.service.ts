import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly context = 'AppStateService';

  private username = new BehaviorSubject<string>('Sesión');
  userState$: Observable<string> = this.username.asObservable();

  private logged = new BehaviorSubject<boolean>(false);
  logged$: Observable<boolean> = this.logged.asObservable();

  constructor(
      private logger:LoggerService
      ){
        this.logger.log(this.context,'AppStateService funcionando');
  }


  setUserState(username: string, context:string): void {
    this.username.next(username);
    this.logger.log(context,` setUserState():${username}`);
  }

  setLoggedState(data: boolean): void {
    this.logged.next(data);
  }
}
