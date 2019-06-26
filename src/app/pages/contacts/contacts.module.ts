import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../components/components.module';
import { ContactRegisterPageModule } from '../contact-register/contact-register.module';
import { ContactsPage } from './contacts.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ContactsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ContactRegisterPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactsPage]
})
export class ContactsPageModule { }
