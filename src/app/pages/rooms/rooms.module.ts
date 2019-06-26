import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoomsPage } from './rooms.page';
import { ComponentsModule } from '../../components/components.module';
import { RoomRegisterPageModule } from '../room-register/room-register.module';

const routes: Routes = [
  {
    path: '',
    component: RoomsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RoomRegisterPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoomsPage]
})
export class RoomsPageModule {}
