import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { UserProfile } from './user-profile.interface';

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
export class MicuentaComponent {
  profileForm: FormGroup;
  isEditing = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private appState: AppStateService,
    private fb: FormBuilder
  ) {
   const initialProfile: UserProfile = {
      name: 'Pablo González',
      email: 'pablo.gonzalez@example.com',
      phone: '+54 9 11 1234-5678',
      address: 'Mendoza',
    };

    this.profileForm = this.fb.group({
      name: [initialProfile.name, [Validators.required, Validators.minLength(3)]],
      email: [initialProfile.email, [Validators.required, Validators.email]],
      phone: [initialProfile.phone, [Validators.required, Validators.pattern(/^\+?\d[\d\s\-]+$/)]],
      address: [initialProfile.address, []],
    });
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if (this.profileForm.valid) {
      // Aquí puedes realizar una lógica adicional para guardar en el backend
      console.log('Datos actualizados:', this.profileForm.value);
      this.isEditing = false;
      
      alert('Perfil actualizado con éxito.');
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
