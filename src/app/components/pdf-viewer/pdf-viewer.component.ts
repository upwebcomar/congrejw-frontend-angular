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
  @Input() pdfSrc!: string; // Ruta del PDF
  @Input() zoom = 1; // Nivel inicial de zoom
  @Input() page = 1; // Página actual
  @Input() showAll = false; // Si se muestra toda la página o una parte

  private lastTouchDistance: number | null = null; // Para detectar el gesto de pellizcar
  private initialZoom: number = 1; // Para el zoom táctil gradual

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Configuración del worker para pdf.js
    GlobalWorkerOptions.workerSrc = '/assets/pdfjs/pdf.worker.min.js';
  }

  // Usamos Renderer2 para escuchar el evento y hacer preventDefault en un listener no pasivo
  ngOnInit() {
    const el = this.el.nativeElement;

    // Añadir el evento 'wheel' para dispositivos de escritorio
    this.renderer.listen(el, 'wheel', this.onWheelScroll.bind(this));

    // Añadir los eventos táctiles para dispositivos móviles
    this.renderer.listen(el, 'touchstart', this.onTouchStart.bind(this));
    this.renderer.listen(el, 'touchmove', this.onTouchMove.bind(this));
    this.renderer.listen(el, 'touchend', this.onTouchEnd.bind(this));
  }

  // Método para ajustar el zoom con el scroll (evento 'wheel')
  onWheelScroll(event: WheelEvent): void {
    if (event.ctrlKey) { // Detecta cuando Ctrl está presionado
      event.preventDefault(); // Evitar el comportamiento predeterminado
      const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1; // Ajustar el zoom hacia adentro o hacia afuera

      // Ajustar el zoom solo si Ctrl está presionado
      this.zoom += zoomDelta;
      this.zoom = Math.min(Math.max(this.zoom, 0.2), 2); // Limitar el zoom entre 0.2 y 2
    }
  }

  // Métodos para manejar el gesto táctil de pellizcar (zoom con dos dedos)
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      const touchDistance = this.getTouchDistance(event);
      this.lastTouchDistance = touchDistance;
      this.initialZoom = this.zoom; // Guardamos el zoom inicial al iniciar el gesto
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.lastTouchDistance !== null) {
      const touchDistance = this.getTouchDistance(event);
      const zoomFactor = touchDistance / this.lastTouchDistance; // Relación de cambio de distancia
      const zoomDelta = (zoomFactor - 1) * 0.7; // El cambio de zoom es más gradual

      this.zoom = this.initialZoom + zoomDelta;
      this.zoom = Math.min(Math.max(this.zoom, 0.2), 2); // Limitar el zoom entre 0.2 y 2

      this.lastTouchDistance = touchDistance; // Actualizar la distancia para el siguiente movimiento
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.lastTouchDistance = null; // Restablecer la distancia cuando se suelta un dedo
    }
  }

  // Calcular la distancia entre dos puntos táctiles (para el gesto de pellizcar)
  private getTouchDistance(event: TouchEvent): number {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy); // Distancia euclidiana entre los dos puntos
  }
}
