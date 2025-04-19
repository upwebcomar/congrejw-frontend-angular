import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent implements OnInit {
  constructor(private title: Title, private appService: AppService) {
    this.appService.initAppState();
  }
  ngOnInit(): void {
    //Indica con que entorno esta trabajando la aplicacion
    console.log(
      'Entorno actual:',
      environment.production ? 'Producción' : 'Desarrollo'
    );
    //Modifico el Title de la app
    this.title.setTitle(`${environment.appName}`);
  }
}
