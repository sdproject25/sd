import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StartpageAdminComponent } from '../startpage_admin/startpage-admin.component';
import { app } from '../../server';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StartpageAdminComponent],
  template: `
      <app-startpage-admin></app-startpage-admin>
  `,
  styles: ['./app.component.css'],
})
export class AppComponent {
  title = 'mein-projekt';
}

