import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = environment.apiUrl + '/files'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData, url: string = this.apiUrl): Observable<any> {
    return this.http.post(`${url}/upload`, formData);
  }

  downloadFile(filename: string, url: string = this.apiUrl): Observable<Blob> {
    return this.http.get(`${url}/download/${filename}`, {
      responseType: 'blob',
    });
  }

  getFiles(url: string = this.apiUrl): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(url);
  }

  deleteFile(filename: string, url: string = this.apiUrl): Observable<any> {
    return this.http.delete(`${url}/delete/${filename}`);
  }

  sanitizeFileName(fileName: string): string {
    return fileName
      .normalize('NFD') // Descompone caracteres con diacríticos
      .replace(/[̀-ͯ]/g, '') // Elimina las marcas diacríticas
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // Sustituye caracteres no válidos por "_"
  }
}
