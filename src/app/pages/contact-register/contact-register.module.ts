import { BrMaskerModule } from 'br-mask';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { ContactRegisterPage } from './contact-register.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrMaskerModule,
    ComponentsModule
  ],
  declarations: [ContactRegisterPage],
  entryComponents: [ContactRegisterPage]
})
export class ContactRegisterPageModule { }
