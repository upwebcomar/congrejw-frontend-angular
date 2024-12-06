import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { RoleService } from '../../auth/roles/role.service';

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
  roles!:string[] 
  private apiUrl = `${environment.apiUrl}/tablero-anuncios`; // Cambia esto por tu endpoint
  context:string = 'TableroanunciosComponent'

  constructor(
    private http: HttpClient,
    private logger:LoggerService,
    private rolesService:RoleService
  ) {}

  ngOnInit(): void {
    this.obtenerAnuncios();
    this.roles = this.rolesService.getRoles() //Cargo los roles del usuario

  }

  obtenerAnuncios(): void {
    this.http.get<TableroAnuncios[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.anuncios = data;
        this.anuncios.forEach(anuncio=>{
          anuncio.pathfile = `${environment.apiUrl}/files/${anuncio.pathfile}`;
          this.logger.log(this.context,'anuncio:',anuncio)
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
