import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'ionic4-date-picker';
import { HeaderAppComponent } from './header-app/header-app.component';
import { IonicModule } from '@ionic/angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { NgModule } from '@angular/core';
import { NanoThumbComponent } from './nano-thumb/nano-thumb.component';

@NgModule({
  declarations: [
    HeaderAppComponent,
    NanoThumbComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgCalendarModule,
    DatePickerModule,
  ],
  exports: [
    HeaderAppComponent,
    NanoThumbComponent,
    NgCalendarModule,
    DatePickerModule
  ]
})
export class ComponentsModule { }
