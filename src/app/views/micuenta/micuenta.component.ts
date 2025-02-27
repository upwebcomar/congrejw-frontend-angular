import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { UserProfile } from './user-profile.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import { LoggerService } from '../../services/logger.service';
import { FileService } from '../files/files.service';

@Component({
  selector: 'app-micuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './micuenta.component.html',
  styles: [
    `
      .card {
        max-width: 400px;
        margin: auto;
      }

      .card-header {
        font-size: 1.5rem;
      }

      img {
        width: 150px;
        height: 150px;
        object-fit: cover;
      }

      button {
        min-width: 100px;
      }
    `,
  ],
})
export class MicuentaComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userId!: number;
  profileImageUrl: string = '/assets/images/placeholder-profile-600x600.jpg';
  profileImageUrlBefore: string =
    '/assets/images/placeholder-profile-600x600.jpg';
  private context = 'MicuentaComponent';
  selectedFile: File | null = null;
  inputFileChange: boolean = false;
  loadingImage: boolean = true;

  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private router: Router,
    private appState: AppStateService,
    private fb: FormBuilder,
    private http: HttpClient,
    private logger: LoggerService
  ) {
    this.userId = this.authService.getUserId();
    const initialProfile: UserProfile = {
      name: '',
      email: '',
      image: '',
      phone: '',
      address: '',
      profile: '',
    };

    this.profileForm = this.fb.group({
      name: [
        initialProfile.name,
        [Validators.required, Validators.minLength(3)],
      ],
      email: [initialProfile.email, [Validators.required, Validators.email]],
      image: [initialProfile.image],

      phone: [
        initialProfile.phone,
        [Validators.required, Validators.pattern(/^\+?\d[\d\s\-]+$/)],
      ],
      address: [initialProfile.address, []],
    });
  }
  ngOnInit(): void {
    this.getUser();
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.profileImageUrlBefore = this.profileImageUrl;
  }
  editCancel() {
    this.isEditing = !this.isEditing;
    this.profileImageUrl = this.profileImageUrlBefore;
  }

  getUser() {
    if (this.userId) {
      this.http
        .get<UserProfile>(`${environment.apiUrl}/users/${this.userId}`)
        .subscribe({
          next: (data) => {
            this.logger.log(this.context, 'data', data);
            this.profileForm.patchValue(data.profile);

            const headers = new HttpHeaders().set(
              'Authorization',
              `Bearer ${this.authService.getToken()}`
            );
            this.http
              .get(
                environment.apiUrl +
                  '/files/image-profile/' +
                  data.profile.image,
                {
                  headers,
                  responseType: 'blob',
                }
              )
              .subscribe({
                next: (imageBlob) => {
                  this.profileImageUrl = URL.createObjectURL(imageBlob); // Crear una URL a partir del blob
                },
                error: (error) => {
                  console.error('Error al obtener la imagen:', error);
                },
              });
          },
          error: (error) => {
            console.error('Error al obtener el Usuario:', error);
            alert(
              'Hubo un problema al cargar los datos del usuario. Por favor, intenta de nuevo más tarde.'
            );
          },
        });
    }
  }

  async saveChanges(): Promise<void> {
    if (!this.profileForm.valid) {
      alert('Por favor corrige los errores antes de guardar.');
      return;
    }

    const fileUploadPromise = this.inputFileChange
      ? this.uploadFile().then((fileName) => {
          console.log('File uploaded successfully!');
          this.profileForm.patchValue({ image: fileName });
        })
      : Promise.resolve(); // Si no cambia el archivo, no hace nada y sigue con el flujo

    try {
      await fileUploadPromise;
      await this.saveProfile(); // Guardar el perfil después de subir el archivo (o directamente si no hubo subida)

      console.log('Profile saved successfully!');
      this.isEditing = false;
      this.inputFileChange = false;
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema. Por favor, intenta de nuevo más tarde.');
    }
  }

  saveProfile(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .put<UserProfile>(
          `${environment.apiUrl}/profiles/${this.userId}`,
          this.profileForm.value
        )
        .subscribe({
          next: () => resolve(),
          error: (error) => reject(error),
        });
    });
  }

  uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.selectedFile) {
        const formData = new FormData();

        // Obtener la extensión original del archivo
        const fileExtension = this.selectedFile.name.split('.').pop();
        const newFileName = `${this.authService.getUserId()}.${fileExtension}`;

        // Crear un nuevo archivo con el contenido original y el nombre deseado
        const renamedFile = new File([this.selectedFile], newFileName, {
          type: this.selectedFile.type,
        });

        formData.append('file', renamedFile);

        this.fileService
          .uploadFile(formData, environment.apiUrl + '/files/image-profile')
          .subscribe({
            next: () => resolve(newFileName),
            error: (err) => reject(err),
          });
      } else {
        resolve(''); // Si no hay archivo seleccionado, simplemente resolvemos
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Crea una copia del archivo usando el constructor File
      this.profileImageUrlBefore = this.profileImageUrl;
    }
    this.selectedFile = file;

    if (this.selectedFile) {
      this.profileImageUrl = URL.createObjectURL(this.selectedFile);
    }
    this.inputFileChange = true;
  }

  private handleError(error: any, userMessage: string): void {
    this.logger.error(this.context, error.message || 'Unknown Error', error);
    alert(userMessage);
  }
  onImageError(): void {
    this.loadingImage = false; // Ocultar el spinner si hay un error
    this.profileImageUrl = '/assets/images/placeholder-profile-600x600.jpg';
  }
  onLogout(): void {
    this.authService.logout();
    this.appState.setLoggedState(false);
    this.router.navigate(['/login']);
  }
}
