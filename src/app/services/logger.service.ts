import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private isProduction = environment.production;
  private context:string = 'LoggerService'
  constructor(
    
  ){this.log(this.context,'LoggerService funcionando')}

  log(context: string, message: string, ...optionalParams: any[]): void {
    if (!this.isProduction) {
      console.log(`[${context}] [LOG]: ${message}`, ...optionalParams);
    }
  }

  info(context: string, message: string, ...optionalParams: any[]): void {
    if (!this.isProduction) {
      console.info(`[${context}] [INFO]: ${message}`, ...optionalParams);
    }
  }

  warn(context: string, message: string, ...optionalParams: any[]): void {
    console.warn(`[${context}] [WARN]: ${message}`, ...optionalParams);
  }

  error(context: string, message: string, ...optionalParams: any[]): void {
    console.error(`[${context}] [ERROR]: ${message}`, ...optionalParams);
  }

  debug(context: string, message: string, ...optionalParams: any[]): void {
    if (!this.isProduction) {
      console.debug(`[${context}] [DEBUG]: ${message}`, ...optionalParams);
    }
  }
}
