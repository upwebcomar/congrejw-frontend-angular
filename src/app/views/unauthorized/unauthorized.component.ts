import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './unauthorized.component.html',
  styles: ``
})
export class UnauthorizedComponent {

}
