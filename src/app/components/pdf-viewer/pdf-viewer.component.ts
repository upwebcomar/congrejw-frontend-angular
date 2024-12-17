import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent {
  @Input() pdfSrc!: string; // Ruta del PDF
  @Input() zoom: number = 1; // Nivel inicial de zoom
  @Input() page: number = 1; // Página actual
  @Input() showAll: boolean = false; // Mostrar todas las páginas o solo una

  isLoading: boolean = true; // Control del spinner
  hasError: boolean = false; // Control para errores de carga

  private lastTouchDistance: number | null = null; // Para detectar el gesto de pellizcar
  private initialZoom: number = 1; // Para el zoom táctil gradual

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router // Inyectamos el servicio Router
  ) {
    // Configuración del worker de PDF.js
    GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
  }

  ngOnInit(): void {
    const el = this.el.nativeElement;

    // Añadir eventos para zoom con scroll y táctil
    this.renderer.listen(el, 'wheel', this.onWheelScroll.bind(this));
    this.renderer.listen(el, 'touchstart', this.onTouchStart.bind(this));
    this.renderer.listen(el, 'touchmove', this.onTouchMove.bind(this));
    this.renderer.listen(el, 'touchend', this.onTouchEnd.bind(this));
  }

  // Evento que se ejecuta cuando el PDF ha terminado de cargarse
  onPdfLoaded(): void {
    this.isLoading = false; // Detener el spinner
    this.hasError = false; // Asegurarse de que no hay errores
  }

  // Evento que se ejecuta cuando ocurre un error al cargar el PDF
  onPdfError(error: any): void {
    this.isLoading = false; // Detener el spinner
    this.hasError = true; // Indicar que hay un error
    console.error('Error cargando el PDF:', error);

    // Mostrar alerta al usuario
    alert('Hubo un problema al cargar el PDF. Serás redirigido al tablero de anuncios.');

    // Redirigir al tablero de anuncios
    this.router.navigate(['/tablero-anuncios']);
  }

  // Método para ajustar el zoom con el scroll (evento 'wheel')
  onWheelScroll(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
      this.zoom += zoomDelta;
      this.zoom = Math.min(Math.max(this.zoom, 0.1), 3); // Limitar el zoom
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
      this.zoom = Math.min(Math.max(this.zoom, 0.2), 2); // Limitar el zoom táctil

      this.lastTouchDistance = touchDistance;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.lastTouchDistance = null;
    }
  }

  // Calcular distancia entre dos toques
  private getTouchDistance(event: TouchEvent): number {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
