import { Routes } from '@angular/router';
import { ImputMaskComponent } from '../imput_mask/imput-mask.component';
import { StartpageAdminComponent } from '../startpage_admin/startpage-admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'imput-mask', pathMatch: 'full' },  // Startseite = input-mask
  { path: 'imput-mask', component: ImputMaskComponent }, // Route für input-mask
  { path: 'startpage-admin', component: StartpageAdminComponent } // Route für startpage-admin
];

