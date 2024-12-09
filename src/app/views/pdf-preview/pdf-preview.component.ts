import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [CommonModule, PdfViewerComponent],
  templateUrl: './pdf-preview.component.html',
  styles: ``,
})
export class PdfPreviewComponent implements OnInit {
  context: string = 'PdfPreviewComponent';
  pdfSrc: string = ''; // URL del PDF
  zoom!: number; // Nivel inicial de zoom
  page: number = 1; // Página inicial
  showAll: boolean = false; // Mostrar todas las páginas o una sola

  constructor(private route: ActivatedRoute, private logger: LoggerService) {}

  ngOnInit(): void {
    // Configuración inicial desde los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.pdfSrc = params['pdfsrc'] || ''; // Obtener el parámetro "pdfSrc"
      this.page = Number(params['page']) || 1; // Asegurar que "page" sea un número
      this.showAll = Number(params['showAll']) == 1 ? true : false; // Convertir number a booleano
      this.logger.log(this.context, 'showAll =', this.showAll);
    });

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
