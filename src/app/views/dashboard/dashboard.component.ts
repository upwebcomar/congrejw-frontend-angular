import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponentService } from './dasboard-component.service';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './views/users/users.component';
import { SidebarService } from './sidebar/sidebar.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,SidebarComponent,CommonModule,UsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl:'./dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('dashboardContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
    sidebarItem$:BehaviorSubject<string>;
  

  constructor(
    private widgetRegistry: DashboardComponentService,
    private sidebarService:SidebarService
  ) {
    this.sidebarItem$ = this.sidebarService.getSidebarItem()

  }

  ngAfterViewInit(): void {
    this.sidebarItem$.subscribe({next:data => {
      this.loadWidget(data);
      }
    })
    
  }

  loadWidget(widgetName: string): void {
    const component = this.widgetRegistry.getWidgetComponent(widgetName);
    if (component) {
      this.container.clear(); // Limpia el contenedor antes de agregar otro componente
      this.container.createComponent(component);
    }
  }
}
