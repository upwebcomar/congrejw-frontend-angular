import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.error('⛔ Notificaciones no soportadas en este navegador.');
      return;
    }

    const permission = await Notification.requestPermission();
    console.log('🔔 Permiso de notificación:', permission);

    if (permission === 'granted') {
      console.log('✅ Permiso concedido');
      return true;
    } else {
      console.warn('⚠️ Permiso denegado o cerrado por el usuario.');
      return false;
    }
  }
}
