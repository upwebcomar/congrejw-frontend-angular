import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AllUserDto } from '../../../../services/users/all-users.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { LoggerService } from '../../../../services/logger.service';
import { NotificationService } from '../../../../services/notifications/notification.service';

interface User {
  id: number;
  name: string;
}

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timeout?: number;
  createdAt?: Date;
  userId: number;
}

@Component({
    selector: 'app-send-notification',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './notifications.component.html',
    styles: []
})
export class SendNotificationComponent {
  notificationForm: FormGroup;
  users: AllUserDto[] = [];
  private context = 'SendNotificationComponent';

  notifications: Notification[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private logger: LoggerService,
    private notifyService: NotificationService
  ) {
    this.getUsers();
    this.notificationForm = this.fb.group({
      userId: ['', Validators.required],
      type: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  getUsers() {
    this.http.get<AllUserDto[]>(environment.apiUrl + '/users').subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        this.logger.log(this.context, error);
      },
    });
  }

  sendNotification() {
    if (this.notificationForm.valid) {
      const newNotification: Notification = {
        id: Date.now(),
        type: this.notificationForm.value.type,
        message: this.notificationForm.value.message,
        userId: this.notificationForm.value.userId,
        createdAt: new Date(),
      };

      try {
        this.notifyService.addNotification(newNotification);
      } catch (error) {
        this.logger.log(this.context, 'Error al enviar notificacion', error);
      }
      this.notificationForm.reset();
      this.logger.log(this.context, 'Notificaciones:', this.notifications);
      alert('Notificacion enviada');
    }
  }
}
