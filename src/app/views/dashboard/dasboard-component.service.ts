import { Injectable, Type } from '@angular/core';
import { UsersComponent } from './views/users/users.component';


@Injectable({ providedIn: 'root' })
export class DashboardComponentService {
  private widgets: { [key: string]: Type<any> } = {
    users: UsersComponent,

  };

  getWidgetComponent(widgetName: string): Type<any> | null {
    return this.widgets[widgetName] || null;
  }
}
