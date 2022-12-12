import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPersonalesPage } from './datos-personales.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPersonalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPersonalesPageRoutingModule {}
