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

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }

  getFiles(): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(this.apiUrl);
  }

  deleteFile(filename: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${filename}`);
  }
  sanitizeFileName(fileName: string): string {
    return fileName
      .normalize('NFD') // Descompone caracteres con diacríticos
      .replace(/[\u0300-\u036f]/g, '') // Elimina las marcas diacríticas
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // Sustituye caracteres no válidos por "_"
  }
  
}
