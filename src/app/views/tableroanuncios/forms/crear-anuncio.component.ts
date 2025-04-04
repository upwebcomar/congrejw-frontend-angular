import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';
import { TableroAnunciosService } from '../../../services/tablero-anuncios/tablero-anuncios.service';
import { MessageService } from '../../../services/messages.services';
import { FileService } from '../../../services/files.service';

@Component({
  selector: 'app-crear-anuncio',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-anuncio.component.html',
})
export class CrearAnuncioComponent {
  anuncioForm: FormGroup;
  pdfFile: File | null = null;
  context: string = 'CrearAnuncioComponent';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private logger: LoggerService,
    private messageService: MessageService,
    private tableroAnunciosService: TableroAnunciosService,
    private fileService: FileService
  ) {
    this.anuncioForm = this.fb.group({
      titulo: [''],
      descripcion: [''],
      page: ['1'],
      show_all: [false],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfFile = input.files[0];
      this.logger.log(this.context, 'Archivo seleccionado:', this.pdfFile);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('titulo', this.anuncioForm.get('titulo')?.value);
    formData.append('descripcion', this.anuncioForm.get('descripcion')?.value);
    formData.append('page', this.anuncioForm.get('page')?.value);
    formData.append('show_all', this.anuncioForm.get('show_all')?.value);
    formData.append('pathfile', this.pdfFile?.name as string);

    if (this.pdfFile) {
      formData.append('file', this.pdfFile);
      formData.forEach((value, key) => {
        this.logger.log(this.context, 'formData', key, value);
      });
    }

    this.tableroAnunciosService.newAnuncio(formData).subscribe({
      next: (response) => {
        this.logger.log(this.context, 'Anuncio creado:', response);
        this.router.navigate(['tablero-anuncios']);
      },
      error: (error) => {
        this.messageService.alert('Error al crear el anuncio:' + error);
      },
    });
  }
}
