import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private loginTextSource = new BehaviorSubject<string>('-');
  private loginHrefSource = new BehaviorSubject<string>('login');
  loginText$ = this.loginTextSource.asObservable();
  loginHref$ = this.loginHrefSource.asObservable();


  updateLoginText(newText: string) {
    this.loginTextSource.next(newText);
  }
  updateLoginHref(path: string) {
    this.loginHrefSource.next(path);
  }
  private actualizaNavbar = new Subject<void>();
  actualizarNavbar$ = this.actualizaNavbar.asObservable();

  actualizarNavbar() {
    this.actualizaNavbar.next();
  }

}
