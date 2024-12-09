import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoggerService } from '../../../services/logger.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-crear-anuncio',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule],
  templateUrl: './crear-anuncio.component.html',
})
export class CrearAnuncioComponent {
  anuncioForm: FormGroup;
  pdfFile: File | null = null;
  context:string = 'CrearAnuncioComponent'

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService
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
      this.logger.log(this.context,'Archivo seleccionado:', this.pdfFile);
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
          formData.forEach((value,key)=>{
            this.logger.log(this.context,'formData',key,value);
          })
      this.http.post(environment.apiUrl+'/tablero-anuncios', formData).subscribe({
        next: (response) => {
          this.logger.log(this.context,'Anuncio creado:', response);
          this.router.navigate(['tablero-anuncios'])
        },
        error: (error) => {
          alert('Error al crear el anuncio:' + error);
        },
      });
    } else {
      alert('Por favor selecciona un archivo PDF.');
    }
  }
}
