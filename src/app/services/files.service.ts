import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /**
   * URL base de la API para operaciones con archivos.
   * Se construye a partir del entorno configurado.
   */
  private apiUrl = environment.apiUrl + '/files';

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo al servidor.
   * @param formData Objeto FormData que contiene el archivo y otros datos si es necesario.
   * @param url (Opcional) URL personalizada de subida. Usa la predeterminada si no se especifica.
   * @returns Observable con la respuesta del servidor.
   */
  uploadFile(formData: FormData, url: string = this.apiUrl): Observable<any> {
    return this.http.post(`${url}/upload`, formData);
  }

  /**
   * Descarga un archivo desde el servidor.
   * @param filename Nombre del archivo a descargar.
   * @param url (Opcional) URL personalizada de descarga. Usa la predeterminada si no se especifica.
   * @returns Observable que emite un Blob con el contenido del archivo.
   */
  downloadFile(filename: string, url: string = this.apiUrl): Observable<Blob> {
    return this.http.get(`${url}/download/${filename}`, {
      responseType: 'blob',
    });
  }
  /**
   * Descarga un archivo y dispara automáticamente la descarga en el navegador.
   * @param filename Nombre del archivo a descargar.
   * @param url (Opcional) URL personalizada. Usa la predeterminada si no se especifica.
   */
  async downloadAndSaveFile(
    filename: string,
    url: string = this.apiUrl
  ): Promise<void> {
    try {
      const blob = await lastValueFrom(
        this.http.get(`${url}/download/${filename}`, { responseType: 'blob' })
      );

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Re-lanza el error para que lo capture el componente
      throw error;
    }
  }

  /**
   * Obtiene la lista de archivos disponibles en el servidor.
   * @param url (Opcional) URL personalizada. Usa la predeterminada si no se especifica.
   * @returns Observable con un objeto que contiene un array de nombres de archivo.
   */
  getFiles(url: string = this.apiUrl): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(url);
  }

  /**
   * Elimina un archivo del servidor.
   * @param filename Nombre del archivo a eliminar.
   * @param url (Opcional) URL personalizada. Usa la predeterminada si no se especifica.
   * @returns Observable con la respuesta del servidor.
   */
  deleteFile(filename: string, url: string = this.apiUrl): Observable<any> {
    return this.http.delete(`${url}/delete/${filename}`);
  }

  /**
   * Sanitiza un nombre de archivo eliminando caracteres especiales o peligrosos.
   * Útil para prevenir errores de codificación o problemas de seguridad.
   * @param fileName Nombre original del archivo.
   * @returns Nombre sanitizado, con caracteres no válidos reemplazados por "_".
   */
  sanitizeFileName(fileName: string): string {
    return fileName
      .normalize('NFD') // Descompone caracteres con diacríticos
      .replace(/[̀-ͯ]/g, '') // Elimina las marcas diacríticas
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // Sustituye caracteres no válidos por "_"
  }
}
