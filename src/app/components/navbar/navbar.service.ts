import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private loginTextSource = new BehaviorSubject<string>('-');
  private loginHrefSource = new BehaviorSubject<string>('login');
  private actualizaNavbar = new Subject<void>();
  loginText$ = this.loginTextSource.asObservable();
  loginHref$ = this.loginHrefSource.asObservable();
  actualizarNavbar$ = this.actualizaNavbar.asObservable();

  updateLoginText(newText: string) {
    this.loginTextSource.next(newText);
  }
  updateLoginHref(path: string) {
    this.loginHrefSource.next(path);
  }


  actualizarNavbar() {
    this.actualizaNavbar.next();
  }

}
