import { Component } from '@angular/core';
import { PushService } from '../../services/push-notifications/push.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [],
  templateUrl: './configuracion.component.html',
  styles: ``,
})
export class ConfiguracionComponent {
  constructor(private pushService: PushService) {}

  solicitarPermiso() {
    this.pushService.requestNotificationPermission();
  }
}
