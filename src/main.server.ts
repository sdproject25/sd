import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { StartpageAdminComponent } from './startpage_admin/startpage-admin.component';
import { ImputMaskComponent } from './imput_mask/imput-mask.component';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
