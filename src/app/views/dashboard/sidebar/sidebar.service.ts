import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class SidebarService {
    private sidebarItem$ = new BehaviorSubject<string>('users');

    getSidebarItem(){
        return this.sidebarItem$
    }
}