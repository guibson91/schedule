import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomRegisterPage } from './room-register.page';
import { ComponentsModule } from '../../components/components.module';
import { BrMaskerModule } from 'br-mask';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    BrMaskerModule,
    IonicModule
  ],
  declarations: [RoomRegisterPage],
  entryComponents: [RoomRegisterPage]
})
export class RoomRegisterPageModule { }
