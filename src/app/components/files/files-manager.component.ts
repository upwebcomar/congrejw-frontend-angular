import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../services/logger.service';
import { FileService } from '../../services/files.service';
import { MessageService } from '../../services/messages.services';

@Component({
  selector: 'app-files-manager',
  imports: [CommonModule],
  templateUrl: './files-manager.component.html',
  styles: '',
})
export class FilesManagerComponent implements OnInit {
  files: string[] = [];
  selectedFile: File | null = null;
  private context: string = 'FilesManagerComponent';

  constructor(
    private fileService: FileService,
    private logger: LoggerService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const sanitizedFileName = this.fileService.sanitizeFileName(
        this.selectedFile.name
      );
      console.log('Sanitized File Name:', sanitizedFileName);
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const sanitizedFileName = this.fileService.sanitizeFileName(
        this.selectedFile.name
      );
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('filename', sanitizedFileName);

      this.fileService.uploadFile(formData).subscribe({
        next: () => {
          alert('File uploaded successfully!');
          this.loadFiles();
        },
        error: (err) => this.handleError(err, 'Error uploading file.'),
      });
    } else {
      this.message.alert('Please select a file to upload.');
    }
  }

  downloadFile(filename: string): void {
    this.fileService
      .downloadAndSaveFile(filename)
      .then(() => {
        this.logger.log(this.context, 'Descarga completada');
      })
      .catch((error) => {
        this.handleError(error, 'Error downloading file.');
      });
  }

  removeFile(filename: string): void {
    if (this.message.confirm('Confirme si desea borrar el archivo')) {
      this.fileService.deleteFile(filename).subscribe({
        next: () => {
          this.message.alert('File deleted successfully!');
          this.loadFiles();
        },
        error: (err) => this.handleError(err, 'Error deleting file.'),
      });
    }
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe({
      next: (files) => {
        this.files = files.files;
        this.logger.log(this.context, 'Archivos en el servidor', this.files);
      },
      error: (err) => this.handleError(err, 'Error loading files.'),
    });
  }

  private handleError(error: any, userMessage: string): void {
    this.logger.error(this.context, error.message || 'Unknown Error', error);
    this.message.alert(userMessage);
  }
}
