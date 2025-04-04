import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { RoleService } from '../../auth/roles/role.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableroAnuncios } from '../../services/tablero-anuncios/tablero-anuncios.interface';
import { TableroAnunciosService } from '../../services/tablero-anuncios/tablero-anuncios.service';
import { InlineSpinnerComponent } from '../../components/spinners/inline-spinner/inline-spinner.component';
import { MessageService } from '../../services/messages.services';

/**
 * Componente encargado de mostrar, gestionar y reordenar anuncios.
 * Incluye funcionalidad para agregar, editar y eliminar anuncios según roles del usuario.
 */
@Component({
  selector: 'app-anuncios',
  imports: [CommonModule, RouterModule, DragDropModule, InlineSpinnerComponent],
  templateUrl: './tableroanuncios.component.html',
  styles: '',
})
export class TableroanunciosComponent implements OnInit {
  /** Lista de anuncios obtenidos del servidor */
  anuncios: TableroAnuncios[] = [];

  /** Bandera de carga para mostrar spinner */
  cargando: boolean = true;

  /** Mensaje de error si falla la carga de anuncios */
  error: string | null = null;

  /** Roles del usuario actual */
  roles!: string[];

  /** URL base para acceder a archivos adjuntos */
  private pathfile = `${environment.apiUrl}/files/`;

  /** Contexto para logging */
  context: string = 'TableroanunciosComponent';

  /** Modo edición activado/desactivado */
  modoEditar: boolean = false;

  /** Roles permitidos para cada acción */
  rolesPermitidos = {
    agregar: ['admin', 'editor'],
    editar: ['admin', 'editor'],
    borrar: ['admin'],
    admin: ['admin'],
  };

  constructor(
    private logger: LoggerService,
    private rolesService: RoleService,
    private tableroAnunciosService: TableroAnunciosService,
    private message: MessageService
  ) {}

  /**
   * Hook de inicialización del componente.
   * Obtiene los anuncios y los roles del usuario.
   */
  ngOnInit(): void {
    this.obtenerAnuncios();
    this.roles = this.rolesService.getRoles();
  }

  /**
   * Obtiene la lista de anuncios desde el servidor.
   * Ordena los anuncios por su posición y añade el path del archivo.
   * Maneja errores de red y muestra mensajes al usuario.
   */
  obtenerAnuncios(): void {
    this.tableroAnunciosService.getAnuncios().subscribe({
      next: (data: TableroAnuncios[]) => {
        this.anuncios = data
          .sort((a, b) => a.position - b.position)
          .map((anuncio) => ({
            ...anuncio,
            pathfile: anuncio.pathfile
              ? `${this.pathfile}${anuncio.pathfile}`
              : '',
          }));
        this.cargando = false;
        this.logger.log(
          this.context,
          'Carga de anuncios desde el servidor',
          this.anuncios
        );
      },
      error: (err) => {
        this.logger.error(this.context, 'Error al obtener anuncios:', err);
        this.error = 'Hubo un problema al cargar los anuncios.';
        this.cargando = false;
      },
    });
  }

  /**
   * Elimina un anuncio por su ID tras confirmación del usuario.
   * @param id - ID del anuncio a eliminar.
   */
  borrarAnuncio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      this.tableroAnunciosService.deleteAnuncio(id).subscribe({
        next: () => {
          this.logger.log(this.context, `Anuncio con ID ${id} eliminado.`);
          this.anuncios = this.anuncios.filter((anuncio) => anuncio.id !== id);
          alert('El anuncio ha sido eliminado correctamente.');
        },
        error: (err) => {
          this.logger.error(this.context, 'Error al eliminar el anuncio:', err);
          this.message.alert('Hubo un problema al eliminar el anuncio.');
        },
      });
    }
  }

  /**
   * Reordena los anuncios localmente tras evento de arrastre y
   * actualiza el orden en el servidor si el usuario tiene permiso.
   * @param event - Evento emitido por CdkDragDrop.
   */
  reordenarAnuncios(event: CdkDragDrop<TableroAnuncios[]>): void {
    if (this.tieneRolPermitido('editar') && this.modoEditar) {
      moveItemInArray(this.anuncios, event.previousIndex, event.currentIndex);

      const anunciosId: { id: number }[] = this.anuncios.map((anuncio) => ({
        id: anuncio.id,
      }));
      this.logger.log(this.context, 'Anuncios reordenados:', anunciosId);

      this.tableroAnunciosService.updateAnuncio(anunciosId).subscribe({
        next: (response) => this.logger.log(this.context, response.message),
        error: (err) => this.logger.error(this.context, err),
      });
    }
  }

  /**
   * Verifica si el usuario tiene permiso para realizar cierta acción según sus roles.
   * @param accion - Acción a verificar: 'agregar', 'editar' o 'borrar'.
   * @returns true si al menos uno de los roles del usuario tiene permiso.
   */
  tieneRolPermitido(accion: 'agregar' | 'editar' | 'borrar'): boolean {
    return this.roles.some((role) =>
      this.rolesPermitidos[accion].includes(role)
    );
  }

  /**
   * Alterna el modo de edición del tablero de anuncios.
   */
  toggleEdit(): void {
    this.modoEditar = !this.modoEditar;
  }
}
