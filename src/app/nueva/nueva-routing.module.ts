import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaPage } from './nueva.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaPageRoutingModule {}
