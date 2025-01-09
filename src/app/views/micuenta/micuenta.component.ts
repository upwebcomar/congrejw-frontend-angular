import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { UserProfile } from './user-profile.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../auth/jwt-payload.interface';
import { LoggerService } from '../../services/logger.service';

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
  jwtPayload: any;
  user:any;
  private context = 'MicuentaComponent';

  constructor(
    private authService: AuthService,
    private router: Router,
    private appState: AppStateService,
    private fb: FormBuilder,
    private http: HttpClient,
    private logger: LoggerService
     
  ) {
    const initialProfile: UserProfile = {
      name: '',
      email: '',
      phone: '',
      address: '',
      profile: ''
    };

    this.profileForm = this.fb.group({
      name: [initialProfile.name, [Validators.required, Validators.minLength(3)]],
      email: [initialProfile.email, [Validators.required, Validators.email]],
      phone: [initialProfile.phone, [Validators.required, Validators.pattern(/^\+?\d[\d\s\-]+$/)]],
      address: [initialProfile.address, []],
    });
  }
  ngOnInit(): void {
    this.getUser()
    
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  getUser(){
    const token = this.authService.getToken()

    if (token) { 
      this.jwtPayload = this.authService.loadDataFromToken(token)
    }
    this.http.get<UserProfile>(`${environment.apiUrl}/users/${this.jwtPayload?.userId}`).subscribe({
      next: (data) => {
          this.logger.log(this.context,'data',data);
          this.profileForm.patchValue(data.profile); // Se espera que `data` tenga las mismas claves que el formulario

      },
      error: (error) => {
        console.error('Error al obtener el Usuario:', error);
        alert('Hubo un problema al cargar los datos del usuario. Por favor, intenta de nuevo más tarde.');
      },
    });
  }


  saveChanges() {
    if (this.profileForm.valid) {
      this.http.put<UserProfile>(`${environment.apiUrl}/profiles/${this.jwtPayload?.userId}`,this.profileForm.value).subscribe({
        next: (data) => {
          console.log(data);
          
        },
        error: (error) => {
          console.error('Error al obtener el perfil:', error);
          alert('Hubo un problema al cargar los datos del perfil. Por favor, intenta de nuevo más tarde.');
        },
      });

      this.isEditing = false;
    } else {
      alert('Por favor corrige los errores antes de guardar.');
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.appState.setLoggedState(false);
    this.router.navigate(['/login']);
  }
}
