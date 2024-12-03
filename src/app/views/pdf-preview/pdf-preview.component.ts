import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [CommonModule, PdfViewerComponent],
  templateUrl: './pdf-preview.component.html',
  styles: ``
})
export class PdfPreviewComponent implements OnInit {
    pdfSrc:string = ''
    zoom!:number
    page!:number
    showAll!:boolean
  constructor(
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del parámetro
    this.route.queryParams.subscribe(params => {
        this.pdfSrc = params['pdfsrc'] || ''; // Obtener el parámetro "pdfSrc"
        this.page = Number(params['page']) || 1; // Asegurar que "page" sea un número
        this.showAll = params['showAll'] === 'true'; // Convertir el string "true"/"false" a booleano
      });
    }
  
  

}
