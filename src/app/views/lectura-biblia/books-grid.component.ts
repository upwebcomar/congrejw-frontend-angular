import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BibleStateService, Book } from './bible-state.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-books-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-grid.component.html',
  styleUrls: ['./books-grid.component.css'],
})
export class BooksGridComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  selectedBook!: Book;
  chapters: number[] = [];
  visibleBooks: { [key: number]: boolean } = {}; // Controlar la visibilidad de los libros
  isvisibilityBooks: boolean = true;
  userId: number = 1;

  constructor(
    private bibleService: BibleStateService,
    private cdr: ChangeDetectorRef, // Inyectamos ChangeDetectorRef
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnInit() {
    // Cargar libros al iniciar
    this.bibleService.loadBooks();
    this.bibleService.getBooks().subscribe((books) => (this.books = books));
  }

  ngOnDestroy() {}

  // Seleccionar un libro y obtener los capítulos leídos por el usuario
  selectBook(book: Book) {
    this.selectedBook = { ...book }; // Clonamos el objeto para forzar la detección de cambios
    this.chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

    this.bibleService
      .getReadChapter(book.name, this.userId)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            const errorMessage =
              error.error?.message ||
              `No se encontraron capítulos leídos para el libro ID ${book.id}`;
            console.warn(errorMessage);
            return of([]); // Retornamos un array vacío para evitar errores en la UI
          }
          throw error; // Relanzamos otros errores
        })
      )
      .subscribe((value) => {
        // Convertir cada elemento de 'value' a número
        const readChapters = value.map((chapter) => Number(chapter));

        // Actualizar el libro con los capítulos leídos convertidos a números
        this.selectedBook = { ...this.selectedBook, readChapters };
      });

    this.toggleVisibility(book);
  }

  // Alternar capítulo leído/no leído
  toggleChapter(chapter: number) {
    if (!this.selectedBook) return;

    const isRead = this.selectedBook.readChapters.includes(chapter);

    if (isRead) {
      this.selectedBook.readChapters = this.selectedBook.readChapters.filter(
        (c) => c !== chapter
      ); // Eliminar capítulo de los leídos // Desmarcar como leído
    } else {
      this.selectedBook.readChapters.push(chapter); // Agregar el capítulo a los leídos; // Marcar como leído
    }
    this.bibleService.updateBook(this.userId, this.selectedBook);
  }

  // Alternar la visibilidad de los capítulos de un libro
  toggleVisibility(book: Book): void {
    this.visibleBooks[book.id] = true;
    this.isvisibilityBooks = false;
  }

  visibilityBooks(book: Book) {
    this.isvisibilityBooks = true;
    this.visibleBooks[book.id] = false;
  }

  // Verificar si un libro es visible
  isBookVisible(book: Book): boolean {
    return this.visibleBooks[book.id] ?? false; // Devuelve si el libro es visible
  }

  // Verificar si un capítulo está leído
  isChapterRead(chapter: number): boolean {
    return this.selectedBook?.readChapters.includes(chapter) ?? false;
  }
}
