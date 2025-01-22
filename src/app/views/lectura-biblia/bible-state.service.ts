import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface Book {
  id: number;
  name: string;
  chapters: number;
  readChapters: number[];
}

@Injectable({ providedIn: 'root' })
export class BibleStateService {
  private books$ = new BehaviorSubject<Book[]>([]);

  constructor(private http: HttpClient) {}

  // Obtener los libros como un observable
  getBooks() {
    return this.books$.asObservable();
  }

  // Cargar libros desde el backend
  loadBooks() {
    return this.http.get<Book[]>('/assets/mocks/books-mock.json').pipe(
      tap((books) => this.books$.next(books))
    );
  }

  // Actualizar el estado de un libro en el backend
  updateBook(book: Book) {
    return this.http.patch<Book>(`/bible/books/${book.id}`, book).pipe(
      tap((updatedBook) => {
        const currentBooks = this.books$.value;
        const index = currentBooks.findIndex((b) => b.id === updatedBook.id);
        if (index !== -1) {
          currentBooks[index] = updatedBook;
          this.books$.next([...currentBooks]);
        }
      })
    );
  }

  // Marcar un capítulo como leído
  markChapterAsRead(bookId: number, chapter: number) {
    const books = this.books$.value;
    const book = books.find((b) => b.id === bookId);

    if (book && !book.readChapters.includes(chapter)) {
      book.readChapters.push(chapter);
      this.updateBook(book).subscribe(); // Sincronizar con el backend
    }
  }

  // Desmarcar un capítulo como leído
  unmarkChapterAsRead(bookId: number, chapter: number) {
    const books = this.books$.value;
    const book = books.find((b) => b.id === bookId);

    if (book) {
      book.readChapters = book.readChapters.filter((c) => c !== chapter);
      this.updateBook(book).subscribe(); // Sincronizar con el backend
    }
  }
}
