import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-pdf-preview-v2',
  standalone: true,
  imports: [CommonModule, PdfViewerComponent],
  templateUrl: './pdf-preview.component.html',
  styles: ``,
})
export class PdfPreviewV2Component implements OnInit {
  @Input () context: string = 'PdfPreviewComponent';
  @Input () pdfSrc: string = ''; // URL del PDF
  @Input () zoom!: number; // Nivel inicial de zoom
  @Input () page: number = 1; // Página inicial
  @Input () showAll: boolean = false; // Mostrar todas las páginas o una sola

  constructor(private route: ActivatedRoute, private logger: LoggerService) {}

  ngOnInit(): void {
        // Configurar zoom según el ancho de la pantalla
        this.adjustZoomToScreenWidth();
  }

  /**
   * Incrementa el nivel de zoom en 0.1, con un límite superior de 3.
   */
  // Métodos públicos para ajustar el zoom
  increaseZoom(): void {
    if (this.zoom < 3) {
      this.zoom += 0.1;
    }
  }

  decreaseZoom(): void {
    if (this.zoom > 0.2) {
      this.zoom -= 0.1;
    }
  }
   // Método para ajustar el zoom basado en el ancho de pantalla
   private adjustZoomToScreenWidth(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth < 576) {
      this.zoom = 0.5;
    } else if (screenWidth < 768) {
      this.zoom = 0.75;
    } else {
      this.zoom = 1;
    }
    console.log(this.zoom);
    
  }
}
