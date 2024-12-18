import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StartpageAdminComponent } from '../startpage_admin/startpage-admin.component';
import { app } from '../../server';
import { ImputMaskComponent } from '../imput_mask/imput-mask.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StartpageAdminComponent, ImputMaskComponent],
  template: `
      <app-imput-mask></app-imput-mask>
  `,
  
})
export class AppComponent {
  title = 'mein-projekt';
}

