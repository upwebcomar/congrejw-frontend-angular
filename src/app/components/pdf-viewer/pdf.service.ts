import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private http: HttpClient) {}

  // Método para obtener el PDF con el encabezado de autenticación
  getPdf(pdfUrl: string): Observable<Blob> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(pdfUrl, { headers, responseType: 'blob' });
  }
}
