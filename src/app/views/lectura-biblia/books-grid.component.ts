import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BibleStateService, Book } from './bible-state.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GetBooksProgressDto } from './dto/getBooksProgress.dto';
@Component({
    selector: 'app-books-grid',
    imports: [CommonModule],
    templateUrl: './books-grid.component.html',
    styleUrls: ['./books-grid.component.css']
})
export class BooksGridComponent implements OnInit {
  books: Book[] = [];
  readBooks: GetBooksProgressDto[] = [];
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
    this.loadBooks();
  }

  async loadBooks() {
    try {
      // Primero carga los libros
      this.books = await firstValueFrom(this.bibleService.loadBooksMock());

      // Luego obtiene el progreso de los libros leídos
      this.readBooks = await firstValueFrom(
        this.bibleService.getBooksProgress(this.userId)
      );
    } catch (error) {
      console.error('Error cargando libros o progreso:', error);
    }
  }

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
    this.loadBooks();
  }

  // Verificar si un libro es visible
  isBookVisible(book: Book): boolean {
    return this.visibleBooks[book.id] ?? false; // Devuelve si el libro es visible
  }

  // Verificar si un capítulo está leído
  isChapterRead(chapter: number): boolean {
    return this.selectedBook?.readChapters.includes(chapter) ?? false;
  }
  getBookProgress(book: Book): number {
    const progressData = this.readBooks.find((rb) => rb.name === book.name);
    const progress = progressData
      ? this.calculateProgress(progressData.totalReadChapters, book.chapters)
      : 0;

    return progress;
  }

  getBookColor(book: Book): string {
    const progress = this.getBookProgress(book);
    return this.getColor(progress);
  }
  getColor(progress: number): string {
    if (progress === 100) return '#008000'; // Verde fuerte (100%)
    if (progress >= 90) return '#FFD700'; // Amarillo dorado (90-99%)
    if (progress >= 80) return '#FFC300'; // Amarillo intenso (80-89%)
    if (progress >= 70) return '#FFA500'; // Naranja (70-79%)
    if (progress >= 60) return '#FF8C00'; // Naranja oscuro (60-69%)
    if (progress >= 50) return '#FF6347'; // Rojo tomate (50-59%)
    if (progress >= 40) return '#FF4500'; // Rojo anaranjado fuerte (40-49%)
    if (progress >= 30) return '#DC143C'; // Rojo carmesí (30-39%)
    if (progress >= 20) return '#B22222'; // Rojo fuego (20-29%)
    if (progress > 0) return '#8B0000'; // Rojo oscuro (1-19%)
    return '#62366E'; // Morado oscuro (0%)
  }

  calculateProgress(readChapters: number, totalChapters: number): number {
    if (!readChapters || totalChapters === 0) return 0;
    return Math.round((readChapters / totalChapters) * 100);
  }
}
