import { Component, OnInit } from '@angular/core';
import { FileService } from './files.service';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../logger.service';

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
    private logger: LoggerService
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
      alert('Please select a file to upload.');
    }
  }

  downloadFile(filename: string): void {
    this.fileService.downloadFile(filename).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.handleError(err, 'Error downloading file.'),
    });
  }

  removeFile(filename: string): void {
    this.fileService.deleteFile(filename).subscribe({
      next: () => {
        alert('File deleted successfully!');
        this.loadFiles();
      },
      error: (err) => this.handleError(err, 'Error deleting file.'),
    });
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
    alert(userMessage);
  }
}
