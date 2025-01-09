import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';
import { environment } from '../../../environments/environment';
import { GruposServiciodelcampo } from './grupos-serviciodelcampo.interface';
import { CommonModule } from '@angular/common';
import { PdfPreviewV2Component } from '../../components/pdf-preview-v2/pdf-preview.component';

@Component({
  selector: 'app-gruposServiciodelcampo',
  standalone: true,
  templateUrl: './grupos-serviciodelcampo.component.html',
  imports: [CommonModule,PdfPreviewV2Component,ReactiveFormsModule]
})
export class gruposServiciodelcampoComponent implements OnInit {
  context: string = 'gruposServiciodelcampoComponent';
  pdfSrc!: string;
  zoom!: number;
  page: number = 1;
  showAll: boolean = false;
  pdfGrupos!: GruposServiciodelcampo;
  editForm!: FormGroup;

  baseEndpoint: string = environment.apiUrl + '/grupos-serviciodelcampo/';
  basePdf: string = environment.apiUrl + '/files/';

  constructor(
    private router: Router,
    private logger: LoggerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.zoom = 1;
    this.page = 1;
    this.showAll = true;
    
  }

  ngOnInit(): void {
    this.obtenerGrupos();
    this.initForm();
  }

  // Inicializa el formulario reactivo
  initForm(): void {
    this.editForm = this.fb.group({
      pathfile: ['', Validators.required],
    });
  }

  // Cargar grupos desde el servidor
  obtenerGrupos(): void {
    this.http.get<GruposServiciodelcampo[]>(this.baseEndpoint).subscribe({
      next: (data) => {
        this.pdfGrupos = data[0];
        this.pdfSrc = this.basePdf + this.pdfGrupos.pathfile;
        this.logger.log(this.context, 'Carga de Grupos Servicio del Campo desde servidor', this.pdfGrupos);
        this.logger.log(this.context, 'pdfSrc', this.pdfSrc);

        // Actualiza el formulario con los datos del grupo
        this.editForm.patchValue({
          pathfile: this.pdfGrupos.pathfile,
        });

        // Actualizar componente
        this.cdr.detectChanges(); // Forzar actualización del DOM.
      },
      error: (err) => {
        this.logger.error(this.context, 'Error al obtener Grupos:', err);
      },
    });
  }

  // Guardar cambios al servidor
  guardarCambios(): void {
    if (this.editForm.valid && this.pdfGrupos) {
      const updatedData = { ...this.pdfGrupos, ...this.editForm.value };
      this.http.put(`${this.baseEndpoint}${this.pdfGrupos.id}`, updatedData).subscribe({
        next: (response) => {
          this.logger.log(this.context, 'Pathfile actualizado con éxito:', response);
          this.pdfSrc = this.basePdf + updatedData.pathfile;
        },
        error: (err) => {
          this.logger.error(this.context, 'Error al actualizar Pathfile:', err);
        },
      });
    }
  }
}
