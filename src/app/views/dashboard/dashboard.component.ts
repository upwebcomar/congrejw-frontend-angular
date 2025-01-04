import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponentService } from './dasboard-component.service';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './views/users/users.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,SidebarComponent,CommonModule,UsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl:'./dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('dashboardContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(private widgetRegistry: DashboardComponentService) {}
  ngAfterViewInit(): void {
    this.loadWidget('users')
  }

 

  loadWidget(widgetName: string): void {
    const component = this.widgetRegistry.getWidgetComponent(widgetName);
    if (component) {
      this.container.clear(); // Limpia el contenedor antes de agregar otro componente
      this.container.createComponent(component);
    }
  }
}
