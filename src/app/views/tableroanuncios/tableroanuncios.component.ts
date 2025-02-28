import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { RoleService } from '../../auth/roles/role.service';
import { TableroAnuncios } from './tableroanuncios.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-anuncios',
    imports: [CommonModule, RouterModule, DragDropModule],
    templateUrl: './tableroanuncios.component.html',
    styles: ''
})
export class TableroanunciosComponent implements OnInit {
  anuncios: TableroAnuncios[] = [];
  cargando: boolean = true;
  error: string | null = null;
  roles!: string[];
  private apiUrl = `${environment.apiUrl}/tablero-anuncios`;
  context: string = 'TableroanunciosComponent';
  modoEditar:boolean = false

  // Roles permitidos para cada acción
  rolesPermitidos = {
    agregar: ['admin', 'editor'], // Roles permitidos para agregar un anuncio
    editar: ['admin', 'editor'],  // Roles permitidos para editar un anuncio
    borrar: ['admin'],            // Roles permitidos para borrar un anuncio
    admin: ['admin'],            // Roles permitidos para borrar un anuncio
  };

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private rolesService: RoleService
  ) {}

  ngOnInit(): void {
    this.obtenerAnuncios();
    this.roles = this.rolesService.getRoles(); // Cargo los roles del usuario
  }

  obtenerAnuncios(): void {
    this.http.get<TableroAnuncios[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.anuncios = data.sort((a, b) => a.position - b.position); // Ordenar por posición
        this.anuncios.forEach((anuncio) => {
          if(anuncio.pathfile){
            anuncio.pathfile = `${environment.apiUrl}/files/${anuncio.pathfile}`;
          }else {
            anuncio.pathfile = ""
          }
          
        });
        this.cargando = false;
        this.logger.log(this.context, 'Carga de anuncios desde el servidor', this.anuncios);
      },
      error: (err) => {
        this.logger.error(this.context, 'Error al obtener anuncios:', err);
        this.error = 'Hubo un problema al cargar los anuncios.';
        this.cargando = false;
      },
    });
  }

  borrarAnuncio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.logger.log(this.context, `Anuncio con ID ${id} eliminado.`);
          this.anuncios = this.anuncios.filter((anuncio) => anuncio.id !== id);
          alert('El anuncio ha sido eliminado correctamente.');
        },
        error: (err) => {
          this.logger.error(this.context, 'Error al eliminar el anuncio:', err);
          alert('Hubo un problema al eliminar el anuncio.');
        },
      });
    }
  }

  reordenarAnuncios(event: CdkDragDrop<TableroAnuncios[]>): void {
    if(this.tieneRolPermitido('editar') && this.modoEditar){
          moveItemInArray(this.anuncios, event.previousIndex, event.currentIndex);

    const anunciosId: { id: number }[] = this.anuncios.map((anuncio) => ({ id: anuncio.id }));
    this.logger.log(this.context, 'Anuncios reordenados:', anunciosId);
    this.http.put(`${this.apiUrl}/reorder`, { order: anunciosId }).subscribe({
      next: () => this.logger.log(this.context, 'Orden actualizado en el servidor.'),
      error: (err) => this.logger.error(this.context, 'Error al actualizar el orden:', err),
    });
    }else{return}


  }

  // Métodos para verificar los roles permitidos
  tieneRolPermitido(accion: 'agregar' | 'editar' | 'borrar'): boolean {
    return this.roles.some((role) => this.rolesPermitidos[accion].includes(role));
  }

  //Toggle boton Editar
  toggleEdit(){this.modoEditar? this.modoEditar = false : this.modoEditar = true}
}
