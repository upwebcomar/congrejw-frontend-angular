import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inline-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inline-spinner.component.html',
  styles: ``,
})
export class InlineSpinnerComponent implements OnInit {
  @Input() visuallyLoad: boolean = false;
  classLoad = 'visually-hidden';

  ngOnInit(): void {
    this.visuallyLoad
      ? (this.classLoad = '')
      : (this.classLoad = 'visually-hidden');
  }
}
