import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private http: HttpClient) {}
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
  async subscribeToPushNotifications() {
    const registration = await navigator.serviceWorker.ready;
    console.log(registration);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        environment.VAPID_PUBLIC_KEY
      ),
    });

    console.log('🔗 Suscripción obtenida:', subscription);
    try {
      console.log(environment.apiUrl + '/push/subscribe');
      await lastValueFrom(
        this.http.post(environment.apiUrl + '/push/subscribe', subscription)
      );
      return 'Subscripcion enviada';
    } catch (error) {
      return error;
    }
  }

  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async sendNotificationTest(notification: any) {
    const notificationPayload = JSON.parse(notification.payload);
    console.log(notificationPayload);

    return this.http.post(notification.url, notificationPayload);
  }
}
