import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { RoleService } from '../auth/roles/role.service';

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
      private logger:LoggerService,
      private roleService:RoleService
      ){
        this.logger.log(this.context,'AppStateService funcionando');
        const token = this.roleService.getToken()
        if(token){
          const payload = this.roleService.loadDataFromToken(token)
          if (payload != undefined){
          this.setUserState(payload.username)
          this.setLoggedState(true)
          }
        }
  }


  setUserState(username: string, context?:string): void {
    this.username.next(username);
      // Solo registra el contexto si está definido
    if (context) {
      this.logger.log(context, `setUserState(): ${username}`);
    }
  }

  setLoggedState(data: boolean): void {
    this.logged.next(data);
  }
}
