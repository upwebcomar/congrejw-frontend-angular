import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoggerService } from '../../services/logger.service';

interface TableroAnuncios {
  id: number;
  titulo: string;
  descripcion: string;
  pathfile: string;
  page: string;
  show_all: boolean;
}

@Component({
  selector: 'app-anuncios',
  standalone:true,
  imports:[CommonModule,RouterModule],
  templateUrl: './tableroanuncios.component.html',
  styles:'',
})
export class TableroanunciosComponent implements OnInit {
  anuncios: TableroAnuncios[] = [];
  cargando: boolean = true;
  error: string | null = null;
  private apiUrl = `${environment.apiUrl}/tablero-anuncios`; // Cambia esto por tu endpoint

  constructor(private http: HttpClient, private logger:LoggerService) {}

  ngOnInit(): void {
    this.obtenerAnuncios();
  }

  obtenerAnuncios(): void {
    this.http.get<TableroAnuncios[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.anuncios = data;
        this.anuncios.forEach(anuncio=>{
          anuncio.pathfile = `${environment.apiUrl}/files/${anuncio.pathfile}`;
        })
        this.cargando = false;
        this.logger.log('TableroanunciosComponent','Carga de anuncios desde el servidor',this.anuncios);
        
      },
      error: (err) => {
        this.logger.error('TableroanunciosComponent','Error al obtener anuncios:', err);
        this.error = 'Hubo un problema al cargar los anuncios.';
        this.cargando = false;
      },
    });
  }
}
