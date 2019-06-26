import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../components/components.module';
import { EventDetailPage } from './event-detail.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventCreatePageModule } from '../event-create/event-create.module';

const routes: Routes = [
  {
    path: '',
    component: EventDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    EventCreatePageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventDetailPage]
})
export class EventDetailPageModule { }