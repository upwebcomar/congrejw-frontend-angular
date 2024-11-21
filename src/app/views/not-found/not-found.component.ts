import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './not-found.component.html',
  styles: ``
})
export class NotFoundComponent {

}
