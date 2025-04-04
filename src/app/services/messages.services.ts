import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  alert(message: string): void {
    alert(message);
  }

  confirm(message: string): boolean {
    return confirm(message);
  }

  // Async version si querés usar Promesas:
  asyncConfirm(message: string): Promise<boolean> {
    return Promise.resolve(confirm(message));
  }

  // Versión para futura integración con traducción
  translateAndAlert(messageKey: string): void {
    const message = this.translate(messageKey); // simulado
    alert(message);
  }

  private translate(key: string): string {
    // A futuro podrías inyectar ngx-translate acá
    const translations: Record<string, string> = {
      'file.upload.success': 'Archivo subido correctamente',
    };

    return translations[key] || key;
  }
}
