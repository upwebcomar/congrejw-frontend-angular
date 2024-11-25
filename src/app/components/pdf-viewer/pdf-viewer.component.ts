import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  standalone:true,
  imports:[PdfViewerModule],
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styles:''
})
export class PdfViewerComponent {
  pdfSrc: string = '/assets/pdfs/Protejase_contra_el_Dengue.pdf'; // Ruta al PDF (puedes cambiarla dinámicamente)
  zoom: number = 1; // Zoom inicial

  zoomIn(): void {
    this.zoom += 0.1;
  }

  zoomOut(): void {
    if (this.zoom > 0.2) {
      this.zoom -= 0.1;
    }
  }
}
