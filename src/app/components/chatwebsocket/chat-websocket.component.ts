import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/websocket/web-socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-chat',
    template: `
    <input [(ngModel)]="message" placeholder="Escribe un mensaje" />
    <button (click)="send()">Enviar</button>
    <div *ngFor="let msg of messages">{{ msg }}</div>
  `
})
export class ChatWebsocketComponent implements OnInit {
  message = '';
  messages: string[] = [];

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    this.wsService.onMessage().subscribe((msg: string) => {
      this.messages.push(msg);
    });
  }

  send() {
    this.wsService.sendMessage(this.message);
    this.message = '';
  }
}
