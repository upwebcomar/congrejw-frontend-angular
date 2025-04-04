import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';
import { environment } from '../../../../environments/environment';
import { FileService } from '../../../services/files.service';
import { TableroAnuncios } from '../../../services/tablero-anuncios/tablero-anuncios.interface';

type TableroAnunciosForm = {
  [K in keyof TableroAnuncios]: FormControl<TableroAnuncios[K]>;
};

@Component({
  selector: 'app-editar-anuncio',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-anuncio.component.html',
})
export class EditarAnuncioComponent implements OnInit {
  anuncioForm!: FormGroup;
  pdfFile: File | null = null;
  anuncioId: string | null = null;
  context: string = 'EditarAnuncioComponent';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private fileService: FileService
  ) {
    // Inicializa el formulario con valores predeterminados
    this.anuncioForm = this.fb.group({
      id: new FormControl<number>(0), // Cambiado para no permitir null en id
      titulo: new FormControl<string>(''), // No permite null en el título
      descripcion: new FormControl<string>(''), // No permite null en la descripción
      pathfile: new FormControl<string>(''), // No permite null en pathfile
      page: new FormControl<string>('1'), // No permite null en page
      show_all: new FormControl<boolean>(false), // No permite null en show_all
    });
  }

  ngOnInit() {
    // Obtiene el ID del anuncio desde la URL
    this.anuncioId = this.route.snapshot.paramMap.get('id');
    if (this.anuncioId) {
      this.logger.log(this.context, 'id anuncio:', this.anuncioId);
      this.cargarDatosAnuncio(this.anuncioId);
    }
  }

  // Carga los datos del anuncio en el formulario
  cargarDatosAnuncio(id: string) {
    this.http.get(environment.apiUrl + '/tablero-anuncios/' + id).subscribe({
      next: (data: Partial<TableroAnuncios>) => {
        this.anuncioForm.patchValue(data);
        this.logger.log(this.context, 'Datos cargados:', data);
      },
      error: (err) => {
        alert('Error al cargar los datos del anuncio: ' + err.message);
      },
    });
  }

  // Maneja la selección de un archivo PDF
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfFile = input.files[0];
      this.logger.log(this.context, 'Archivo seleccionado:', this.pdfFile);
    }
  }
  clearPathfile() {
    const confirmDelete = confirm(
      '¿Estás seguro de que deseas eliminar el contenido?'
    );
    if (confirmDelete) {
      this.anuncioForm.get('pathfile')?.setValue('');
    }
  }

  // Envía los datos para modificar el anuncio
  onSubmit() {
    if (!this.anuncioId) {
      alert('No se puede identificar el anuncio a modificar.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.anuncioForm.get('titulo')?.value);
    formData.append('descripcion', this.anuncioForm.get('descripcion')?.value);
    let pathfile = this.anuncioForm.get('pathfile')?.value;
    pathfile = this.fileService.sanitizeFileName(pathfile);
    formData.append('pathfile', pathfile);
    formData.append('page', this.anuncioForm.get('page')?.value);
    if (this.anuncioForm.get('show_all')?.value == true) {
      formData.append('show_all', this.anuncioForm.get('show_all')?.value);
    }
    if (this.pdfFile) {
      formData.append('file', this.pdfFile);
    }

    // Mostrar el contenido de FormData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.http
      .put(`${environment.apiUrl}/tablero-anuncios/${this.anuncioId}`, formData)
      .subscribe({
        next: (response) => {
          this.logger.log(this.context, 'Anuncio modificado:', response);
          this.router.navigate(['tablero-anuncios']);
        },
        error: (error) => {
          alert('Error al modificar el anuncio: ' + error.message);
        },
      });
  }
}
