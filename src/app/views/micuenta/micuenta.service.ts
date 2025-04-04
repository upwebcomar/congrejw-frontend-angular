import { Injectable } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../auth/auth.service';
import { AppStateService } from '../../services/app-state.service';
import { BehaviorSubject } from 'rxjs';
import { FileService } from '../../services/files.service';

@Injectable({
  providedIn: 'root',
})
export class MicuentaService {
  selectedFile!: File;
  imageDefault = '/assets/images/placeholder-profile-600x600.jpg';
  private _profileImageUrl = new BehaviorSubject<string>(this.imageDefault);
  profileImageUrl$ = this._profileImageUrl.asObservable();

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private appState: AppStateService,
    private fileService: FileService
  ) {}

  getUserProfile(userId: number) {
    return this.userService.getUserProfile(userId);
  }

  getProfileImage(image: string) {
    return this.userService.getProfileImage(image);
  }

  getUserId() {
    return this.authService.getUserId();
  }

  getProfileImageUrl(): string {
    return this._profileImageUrl.getValue(); // lee el valor actual
  }

  setProfileImageUrl(url: string): void {
    this._profileImageUrl.next(url); // emite nuevo valor
  }

  saveProfile(userId: number, profileFormValue: any) {
    return this.userService.saveProfile(userId, profileFormValue);
  }
  uploadFile(formData: FormData, url: string) {
    return this.fileService.uploadFile(formData, url);
  }

  logout() {
    this.authService.logout();
    this.appState.setLoggedState(false);
  }
}
