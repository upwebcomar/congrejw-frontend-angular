import { Injectable, Type } from '@angular/core';
import { UsersComponent } from './views/users/users.component';
import { SendNotificationComponent } from './views/notifications/notifications.component';
import { PushNotificationsComponent } from './views/push-notifications/push-notifications.component';
import { FilesComponent } from './views/files/files.component';

@Injectable({ providedIn: 'root' })
export class DashboardComponentService {
  private widgets: { [key: string]: Type<any> } = {
    users: UsersComponent,
    notifications: SendNotificationComponent,
    pushNotification: PushNotificationsComponent,
    filesManager: FilesComponent,
  };

  getWidgetComponent(widgetName: string): Type<any> | null {
    return this.widgets[widgetName] || null;
  }
}
