import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl); // Ajusta la URL según sea necesario
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  onMessage(): Observable<string> {
    return new Observable((subscriber) => {
      this.socket.on('message', (data: string) => {
        subscriber.next(data);
      });

      return () => {
        this.socket.off('message');
      };
    });
  }
}
