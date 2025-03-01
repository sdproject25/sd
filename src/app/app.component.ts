import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { StartpageAdminComponent } from '../startpage_admin/startpage-admin.component';
import { app } from '../../server';
import { ImputMaskComponent } from '../imput_mask/imput-mask.component';
import { Router } from 'express';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StartpageAdminComponent, ImputMaskComponent, RouterModule],
  template: `
       <router-outlet></router-outlet>
  `,
  
})
export class AppComponent {
  title = 'mein-projekt';
}

