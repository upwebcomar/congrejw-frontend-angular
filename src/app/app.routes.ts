import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MicuentaComponent } from './micuenta/micuenta.component';
import { TableroanunciosComponent } from './views/tableroanuncios/tableroanuncios.component';


export const routes: Routes = [
    {path:"",component:HomeComponent},
    {path:"modal",component:ModalComponent},
    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},
    {path:"micuenta",component:MicuentaComponent},
    {path:"tableroanun",component:TableroanunciosComponent}
];
