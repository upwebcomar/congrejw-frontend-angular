import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GlobalWorkerOptions } from 'pdfjs-dist';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent {
  @Input() pdfSrc!: string; // Ruta del PDF
  @Input() zoom!:number; // Nivel inicial de zoom
  @Input() page = 1; // Página actual
  @Input() showAll = false; // Mostrar toda la página o parte

  private lastTouchDistance: number | null = null; // Para detectar el gesto de pellizcar
  private initialZoom: number = 1; // Para el zoom táctil gradual

  constructor(private el: ElementRef, private renderer: Renderer2) {
    GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
  }

  ngOnInit() {
    const el = this.el.nativeElement;



    // Añadir eventos
    this.renderer.listen(el, 'wheel', this.onWheelScroll.bind(this));
    this.renderer.listen(el, 'touchstart', this.onTouchStart.bind(this));
    this.renderer.listen(el, 'touchmove', this.onTouchMove.bind(this));
    this.renderer.listen(el, 'touchend', this.onTouchEnd.bind(this));
  }

 



  // Método para ajustar el zoom con el scroll (evento 'wheel')
  onWheelScroll(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
      this.zoom += zoomDelta;
      this.zoom = Math.min(Math.max(this.zoom, 0.1), 3);
    }
  }

  // Métodos táctiles
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      const touchDistance = this.getTouchDistance(event);
      this.lastTouchDistance = touchDistance;
      this.initialZoom = this.zoom;
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.lastTouchDistance !== null) {
      const touchDistance = this.getTouchDistance(event);
      const zoomFactor = touchDistance / this.lastTouchDistance;
      const zoomDelta = (zoomFactor - 1) * 0.7;

      this.zoom = this.initialZoom + zoomDelta;
      this.zoom = Math.min(Math.max(this.zoom, 0.2), 2);

      this.lastTouchDistance = touchDistance;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.lastTouchDistance = null;
    }
  }

  private getTouchDistance(event: TouchEvent): number {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
