import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaPageRoutingModule } from './nueva-routing.module';

import { NuevaPage } from './nueva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaPageRoutingModule
  ],
  declarations: [NuevaPage]
})
export class NuevaPageModule {}
