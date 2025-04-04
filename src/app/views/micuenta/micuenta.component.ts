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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoggerService } from '../../services/logger.service';
import { FileService } from '../../services/files.service';
import {
  Profile,
  UserProfile,
  UsersService,
} from '../../services/users.service';
import { MessageService } from '../../services/messages.services';
import { firstValueFrom } from 'rxjs';
import { MicuentaService } from './micuenta.service';

@Component({
  selector: 'app-micuenta',
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
  profileImageUrlBefore: string =
    '/assets/images/placeholder-profile-600x600.jpg';
  private context = 'MicuentaComponent';
  selectedFile: File | null = null;
  inputFileChange: boolean = false;
  loadingImage: boolean = true;
  get profileImageUrl(): string {
    return this.miCuentaService.getProfileImageUrl();
  }
  set profileImageUrl(url: string) {
    this.miCuentaService.setProfileImageUrl(url);
  }

  constructor(
    private fileService: FileService,
    private miCuentaService: MicuentaService,
    private router: Router,
    private fb: FormBuilder,
    private logger: LoggerService,
    private message: MessageService
  ) {
    this.userId = this.miCuentaService.getUserId();
    const initialProfile: Profile = {
      name: '',
      email: '',
      image: '',
      phone: '',
      address: '',
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
      this.miCuentaService.getUserProfile(this.userId).subscribe({
        next: (data: UserProfile) => {
          this.logger.log(this.context, 'data', data);
          this.profileForm.patchValue(data.profile);

          this.miCuentaService.getProfileImage(data.profile.image).subscribe({
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
          this.message.alert(
            'Hubo un problema al cargar los datos del usuario. Por favor, intenta de nuevo más tarde.'
          );
        },
      });
    }
  }

  // se utiliza en el template
  async saveChanges(): Promise<void> {
    if (!this.profileForm.valid) {
      this.message.alert('Por favor corrige los errores antes de guardar.');
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
      await firstValueFrom(
        this.miCuentaService.saveProfile(this.userId, this.profileForm.value)
      );
      this.logger.log(this.context, 'Profile saved successfully!');
      this.isEditing = false;
      this.inputFileChange = false;
    } catch (error) {
      this.logger.error(this.context, 'Error:', error);
      this.message.alert(
        'Hubo un problema. Por favor, intenta de nuevo más tarde.'
      );
    }
  }

  uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.selectedFile) {
        const formData = new FormData();

        // Obtener la extensión original del archivo
        const fileExtension = this.selectedFile.name.split('.').pop();
        const newFileName = `${this.miCuentaService.getUserId()}.${fileExtension}`;

        // Crear un nuevo archivo con el contenido original y el nombre deseado
        const renamedFile = new File([this.selectedFile], newFileName, {
          type: this.selectedFile.type,
        });

        formData.append('file', renamedFile);

        this.miCuentaService
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

  onImageError(): void {
    this.loadingImage = false; // Ocultar el spinner si hay un error
    this.profileImageUrl = this.miCuentaService.imageDefault; // Muestra imagen por defecto
  }

  onLogout(): void {
    this.miCuentaService.logout();
    this.router.navigate(['/login']);
  }
}
