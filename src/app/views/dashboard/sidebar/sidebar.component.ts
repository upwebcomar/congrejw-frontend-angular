import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  isCollapsed = true;
  @Input() set linkActive(value: string) {
    this.updateLinkActive(value);
  }
  isActiveUsuarios: boolean = false;
  isActiveFilesManager: boolean = false;
  isActiveNotifications: boolean = false;
  isActivePushNotification: boolean = false;
  sidebarItem$: BehaviorSubject<string>;

  constructor(private sidebarService: SidebarService) {
    this.sidebarItem$ = this.sidebarService.getSidebarItem();
    this.sidebarItem$.subscribe({
      next: (value) => {
        this.updateLinkActive(value);
      },
    });
  }
  ngOnInit(): void {
    this.sidebarItem$.next('users');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  notCollapsedSidebar() {
    this.isCollapsed = false;
  }

  sidebarItem(value: string) {
    console.log(value);

    this.sidebarItem$.next(value);
  }

  updateLinkActive(value: string) {
    this.isActiveUsuarios = false;
    this.isActiveNotifications = false;
    this.isActivePushNotification = false;
    this.isActiveFilesManager = false;

    switch (value) {
      case 'users':
        this.isActiveUsuarios = true;
        break;
      case 'notifications':
        this.isActiveNotifications = true;
        break;
      case 'pushNotification':
        this.isActivePushNotification = true;
        break;
      case 'filesManager':
        this.isActiveFilesManager = true;
        break;
      default:
      // Código si no coincide con ninguno de los valores anteriores
    }
  }
}
