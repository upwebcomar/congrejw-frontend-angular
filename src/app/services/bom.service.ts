import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BomService {
  // Subjects privados
  private readonly screenSizeSubject = new BehaviorSubject(
    this.getScreenSize()
  );
  private readonly isOnlineSubject = new BehaviorSubject(navigator.onLine);
  private readonly isPageVisibleSubject = new BehaviorSubject(
    document.visibilityState === 'visible'
  );

  constructor(private zone: NgZone) {
    // Escuchas fuera de Angular para rendimiento
    this.zone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(map(() => this.getScreenSize()))
        .subscribe((size) =>
          this.zone.run(() => this.screenSizeSubject.next(size))
        );

      merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
      ).subscribe((status) =>
        this.zone.run(() => this.isOnlineSubject.next(status))
      );

      fromEvent(document, 'visibilitychange')
        .pipe(map(() => document.visibilityState === 'visible'))
        .subscribe((visible) =>
          this.zone.run(() => this.isPageVisibleSubject.next(visible))
        );
    });
  }

  // Getters públicos: accedés directamente con .screenSize$, .isOnline$, etc.
  get screenSize$() {
    return this.screenSizeSubject.asObservable();
  }

  get isOnline$() {
    return this.isOnlineSubject.asObservable();
  }

  get isPageVisible$() {
    return this.isPageVisibleSubject.asObservable();
  }

  // Accesos simples
  get language(): string {
    return navigator.language;
  }

  get location(): Location {
    return window.location;
  }

  get history(): History {
    return window.history;
  }

  getBattery(): Promise<any> {
    if ('getBattery' in navigator) {
      return (navigator as any).getBattery();
    }
    return Promise.resolve(null);
  }

  // Utilidad privada
  private getScreenSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
}
