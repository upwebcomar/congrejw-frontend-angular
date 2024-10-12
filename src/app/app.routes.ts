import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModalComponent } from './components/modal/modal.component';

export const routes: Routes = [
    {path:"",component:HomeComponent},
    {path:"modal",component:ModalComponent}
];
