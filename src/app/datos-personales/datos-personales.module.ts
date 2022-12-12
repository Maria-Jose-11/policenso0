import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPersonalesPageRoutingModule } from './datos-personales-routing.module';

import { DatosPersonalesPage } from './datos-personales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPersonalesPageRoutingModule
  ],
  declarations: [DatosPersonalesPage]
})
export class DatosPersonalesPageModule {}
