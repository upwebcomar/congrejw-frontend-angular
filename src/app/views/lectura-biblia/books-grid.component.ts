import { Component, OnInit } from '@angular/core';
import { BibleStateService, Book } from './bible-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-grid.component.html',
  styleUrls: ['./books-grid.component.css'],
})
export class BooksGridComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;
  chapters: number[] = [];
  visibleBooks: { [key: number]: boolean } = {}; // Controlar la visibilidad de los libros
  isvisibilityBooks: boolean = true

  constructor(private bibleService: BibleStateService) {}

  ngOnInit() {
    // Cargar libros al iniciar
    this.bibleService.loadBooks().subscribe();
    this.bibleService.getBooks().subscribe((books) => (this.books = books));
  }

  // Seleccionar un libro
  selectBook(book: Book) {
    this.selectedBook = book;
    this.chapters = Array.from({ length: book.chapters }, (_, i) => i + 1); // Crear lista de capítulos
    this.toggleVisibility(book)
  }

  // Alternar capítulo leído/no leído
  toggleChapter(chapter: number) {
    if (!this.selectedBook) return;

    const isRead = this.selectedBook.readChapters.includes(chapter);

    if (isRead) {
      this.bibleService.unmarkChapterAsRead(this.selectedBook.id, chapter);
    } else {
      this.bibleService.markChapterAsRead(this.selectedBook.id, chapter);
    }
  }

  // Alternar la visibilidad de los capítulos de un libro
  toggleVisibility(book: Book): void {
    
    this.visibleBooks[book.id] = true
    this.isvisibilityBooks = false
  }

  visibilityBooks(book: Book){
    this.isvisibilityBooks = true
    this.visibleBooks[book.id] = false
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
