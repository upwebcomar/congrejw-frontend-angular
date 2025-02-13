import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Notification } from '../../views/notifications/notification.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifyVisibility = new BehaviorSubject<boolean>(false);
  private nextId = 0;
  private context = 'NotificationService';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private logger: LoggerService
  ) {
    this.getNotifications();
  }

  get notifications$(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  addNotification(notification: Omit<Notification, 'id'>): void {
    this.httpClient
      .post<Notification>(environment.apiUrl + '/notifications', notification)
      .subscribe({
        next: (response) => {
          this.logger.log(this.context, 'Notificacion enviada', response);
          this.notificationsSubject.next(this.notifications);
        },
        error: (error) => {
          console.log('error al agregar notificacion', error);
        },
      });
  }

  getNotifications(): void {
    const userId = this.authService.getUserId();

    this.httpClient
      .get<Notification[]>(environment.apiUrl + '/notifications', {
        params: { userId: userId.toString() },
      })
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.notificationsSubject.next(this.notifications);
        },
        error: (error) => {
          this.logger.log(
            this.context,
            'Error al cargar las notificaciones',
            error
          );
          alert('Error al cargar las notificaciones');
        },
      });
  }

  removeNotification(id: number): void {
    this.httpClient
      .delete(environment.apiUrl + '/notifications/' + id)
      .subscribe({
        next: (result) => {
          this.notifications = this.notifications.filter(
            (notif) => notif.id !== id
          );
          this.notificationsSubject.next([...this.notifications]);
        },
        error: (error) => {
          this.logger.log(
            this.context,
            'Error al borrar la notificacion',
            error
          );
          alert('Error al borrar la notificacion');
        },
      });
  }
}
