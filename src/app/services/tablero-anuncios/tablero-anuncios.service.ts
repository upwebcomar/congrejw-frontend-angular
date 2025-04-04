import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TableroAnuncios } from './tablero-anuncios.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableroAnunciosService {
  private apiUrl = `${environment.apiUrl}/tablero-anuncios`;

  constructor(private http: HttpClient) {}

  getAnuncios(): Observable<TableroAnuncios[]> {
    return this.http.get<TableroAnuncios[]>(this.apiUrl);
  }
  newAnuncio(formulario: FormData): Observable<Object> {
    return this.http.post(environment.apiUrl + '/tablero-anuncios', formulario);
  }
  deleteAnuncio(id: number): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateAnuncio(
    anunciosId: {
      id: number;
    }[]
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/reorder`, {
      order: anunciosId,
    });
  }
}
