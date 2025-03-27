import { Component } from '@angular/core';
import { PushNotificationService } from '../../services/push-notifications/push-notification.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [],
  templateUrl: './configuracion.component.html',
  styles: ``,
})
export class ConfiguracionComponent {
  constructor(private pushService: PushNotificationService) {}

  solicitarPermiso() {
    this.pushService.requestNotificationPermission();
  }
}
