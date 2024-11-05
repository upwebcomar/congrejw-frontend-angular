import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template:`<router-outlet />`,
  styles:``
})
export class AppComponent {
  title = 'congrejw';
}
