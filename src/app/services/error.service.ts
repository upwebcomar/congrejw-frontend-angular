import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private logger: LoggerService) {}

  handle(context: string, error: any, userMessage: string): void {
    this.logger.error(context, error.message || 'Unknown error', error);
    alert(userMessage);
  }
}
