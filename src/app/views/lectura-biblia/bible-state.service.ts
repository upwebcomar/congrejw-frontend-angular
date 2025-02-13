import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Book {
  id: number;
  name: string;
  chapters: number;
  readChapters: number[];
}

@Injectable({ providedIn: 'root' })
export class BibleStateService {
  private books$ = new BehaviorSubject<Book[]>([]); // Emite los libros
  bookSubject = new BehaviorSubject<Book | null>(null); // Emite cambios en un libro específico

  constructor(private http: HttpClient) {}

  // Obtener todos los libros
  getBooks() {
    return this.books$.asObservable();
  }

  // Cargar libros (simulación)
  loadBooks() {
    this.http
      .get<Book[]>('/assets/mocks/books-mock.json') // Ruta mock de los libros
      .subscribe((books) => {
        this.books$.next(books); // Emitir los libros cargados
      });
  }

  // Actualizar el libro específico en el comportamiento observable
  updateBook(userId: number, book: Book) {
    this.http
      .patch(`${environment.apiUrl}/bible/books/user/${userId}`, book)
      .pipe(
        catchError((error) => {
          console.error('Error actualizando libro:', error);
          return throwError(() => error); // Relanza el error para que pueda ser manejado externamente
        })
      )
      .subscribe({
        next: () => console.log('Libro actualizado'),
        error: (error) => console.log('Error en la petición:', error),
      });
  }
  // Obtener capítulos leídos de un libro por el usuario
  getReadChapter(name: string, userId: number) {
    return this.http.get<number[]>(
      `${environment.apiUrl}/bible/books/${name}/user/${userId}/read-chapters`
    );
  }
}
