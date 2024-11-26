import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GlobalWorkerOptions } from 'pdfjs-dist';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styles: '',
})
export class PdfViewerComponent {
  @Input() pdfSrc!:string // Ruta del PDF
  @Input() zoom = 1; // Nivel inicial de zoom

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Configuración del worker para pdf.js
    GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
  }

  // Usamos Renderer2 para escuchar el evento y hacer preventDefault en un listener no pasivo
  ngOnInit() {
    const el = this.el.nativeElement;

    // Añadir el evento 'wheel' con 'passive: false'
    this.renderer.listen(el, 'wheel', this.onWheelScroll.bind(this));
  }

  // Método para ajustar el zoom con el scroll
  onWheelScroll(event: WheelEvent): void {
    if (event.ctrlKey) { // Detectar combinación Ctrl+Scroll
      event.preventDefault(); // Evitar el comportamiento predeterminado
      this.zoom += event.deltaY > 0 ? -0.1 : 0.1; // Zoom in/out
      this.zoom = Math.min(Math.max(this.zoom, 0.2), 2); // Limitar entre 0.5 y 2
    }
  }
}
