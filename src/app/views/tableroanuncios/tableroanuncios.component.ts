import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerComponent } from '../../components/pdf-viewer/pdf-viewer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tableroanuncios',
  standalone: true,
  imports: [CommonModule,RouterModule, PdfViewerComponent],
  templateUrl: './tableroanuncios.component.html',
  styles: '',
})
export class TableroanunciosComponent {
 
}
