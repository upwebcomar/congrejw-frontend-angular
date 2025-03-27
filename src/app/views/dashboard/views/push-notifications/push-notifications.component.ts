import { Component } from '@angular/core';
import { PushNotificationComponent } from '../../../../services/push-notifications/push-notification.component';

/**
 * View que muestra el componente app-pushNotification
 */

@Component({
  selector: 'dashboard-PushNotifications',
  imports: [PushNotificationComponent],
  template: `<app-pushNotification></app-pushNotification>`,
  styles: ``,
})
export class PushNotificationsComponent {}
