import { Component, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ContactRegisterPage } from '../contact-register/contact-register.page';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { removeSymbol } from '../../util/util';
import { Contact } from 'src/app/models/contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage {

  subscription: Subscription;

  constructor(public shared: SharedService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public router: Router,
    public ref: ChangeDetectorRef) {

  }

  async add() {
    console.log("Adicionar novo contato");
    let modal = await this.modalCtrl.create({
      component: ContactRegisterPage
    });
    modal.present();
  }

  sendSms(contact: Contact) {
    console.log("Contato: ", contact);
    let number = removeSymbol(contact.cellphone);
    console.log("Número: ", number);
    let msg = `Bom dia, ${contact.name}! Passando aqui pra lembrar que você tem uma reserva no Coworking Parquelândia hoje! Esperamos por você!`;

    this.shared.sendSms(number, msg).subscribe((res) => {
      console.log("Mensagem enviada com sucesso", res);
    }, error => {
      console.error("Erro ao enviar mensagem", error);
    })

  }


  async edit(contact) {
    console.log("Editar contato..");
    let modal = await this.modalCtrl.create({
      component: ContactRegisterPage,
      componentProps: {
        contact: contact
      }
    });
    modal.present();
  }

  openSchedule(contact) {
    this.router.navigate(['/tabs/event-detail', {
      contactId: contact.id
    }])
  }

}