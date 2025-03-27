import { Component } from '@angular/core';
import { PushNotificationService } from './push-notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pushNotification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './push-notification.component.html',
  styles: '',
})
export class PushNotificationComponent {
  notificacion = {
    url: '',
    payload: '',
  };
  constructor(private pushService: PushNotificationService) {}

  async requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('✅ Permiso concedido para notificaciones');
      this.pushService.subscribeToPushNotifications();
    } else {
      console.warn('❌ Permiso denegado');
    }
  }

  async subcripcionPushNotification() {
    console.log('metodo subcripcionPushNotification() ');
    const response = await this.pushService.subscribeToPushNotifications();
    console.log(response);
  }

  async enviarNotificacion() {
    let jsonPayload = JSON.parse(this.notificacion.payload);
    console.log('parse', jsonPayload);

    this.notificacion.payload = JSON.stringify(jsonPayload);

    console.log('Enviando notificación:', this.notificacion);
    (await this.pushService.sendNotificationTest(this.notificacion)).subscribe(
      () => console.log('Notificacion enviada')
    );
  }
}
