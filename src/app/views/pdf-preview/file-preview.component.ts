import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { LoggerService } from '../../services/logger.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-file-preview',
    imports: [CommonModule, PdfViewerComponent],
    templateUrl: './file-preview.component.html',
    styles: []
})
export class FilePreviewComponent implements OnInit {
  context: string = 'FilePreviewComponent';
  fileSrc: string = ''; // URL del archivo
  fileType: 'pdf' | 'image' | 'unknown' = 'unknown'; // Tipo de archivo
  zoom!: number; // Nivel inicial de zoom
  page: number = 1; // Página inicial
  showAll: boolean = false; // Mostrar todas las páginas o una sola
  imageUrl!: SafeUrl;
  loadingImage: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private logger: LoggerService,
    private authService: AuthService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Configuración inicial desde los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.fileSrc = params['filesrc'] || ''; // Obtener el parámetro "fileSrc"
      this.page = Number(params['page']) || 1; // Asegurar que "page" sea un número
      this.showAll = Number(params['showAll']) === 1; // Convertir number a booleano
      this.logger.log(this.context, 'showAll =', this.showAll);

      console.log('fileSrc', this.fileSrc);

      // Determinar el tipo de archivo basándose en la extensión
      const fileExtension = this.obtenerExtensionArchivo(this.fileSrc);
      if (fileExtension === 'pdf') {
        this.fileType = 'pdf';
      } else if (
        ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension)
      ) {
        this.fileType = 'image';
        this.loadImage();
      } else {
        this.fileType = 'unknown';
      }
    });

    // Configurar zoom según el ancho de la pantalla
    this.adjustZoomToScreenWidth();
  }

  // Función para obtener la extensión del archivo
  private obtenerExtensionArchivo(url: string): string {
    const urlSinParametros = url.split(/[#?]/)[0];
    const extension = urlSinParametros.split('.').pop()?.trim().toLowerCase();
    return extension || '';
  }

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

  loadImage(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    this.http.get(this.fileSrc, { headers, responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (error) => {
        console.error('Error al cargar la imagen', error);
      },
    });
  }
  onImageError(): void {
    this.loadingImage = false; // Ocultar el spinner en caso de error
    this.imageUrl = '/assets/images/placeholder-loadImageError.jpg'; // Imagen de respaldo
  }
}
