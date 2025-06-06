import { Component, Input, OnInit } from '@angular/core';
import {
  Notification,
  NotificationService,
} from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styles: [
    `
      .toast {
        margin-bottom: 10px;
        opacity: 0.95;
      }
    `,
  ],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  notifyVisibility: boolean = true;

  constructor(private notificationService: NotificationService) {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
    this.notificationService.notifyVisibility.subscribe((value) => {
      this.notifyVisibility = !this.notifyVisibility;
    });
  }
  ngOnInit(): void {}

  removeNotification(id: number): void {
    this.notificationService.removeNotification(id);
  }

  toastClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'info':
        return 'bg-primary text-white';
      case 'warning':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary text-white';
    }
  }
}
