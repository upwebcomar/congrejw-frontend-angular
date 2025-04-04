import { Component } from '@angular/core';
import { FilesManagerComponent } from '../../../../components/files/files-manager.component';

/**
 * View que muestra el componente app-pushNotification
 */

@Component({
  selector: 'dashboard-files',
  imports: [FilesManagerComponent],
  template: `<app-files-manager></app-files-manager>`,
  styles: ``,
})
export class FilesComponent {}
