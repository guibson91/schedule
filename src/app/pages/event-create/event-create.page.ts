import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../models/contact';
import { Event } from '../../models/event';
import { firestore } from 'firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { removeSymbol } from '../../util/util';
import { Room } from '../../models/room';
import { SharedService } from '../../services/shared.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { User } from '../../models/user';


@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage implements OnInit {

  @Input() room: Room;

  @Input() event: Event;

  //Somente dia [INPUT]
  eventDay: Date;

  //Somente hora de início [INPUT]
  eventStartHour: any;

  //Somente hora de fim [INPUT]
  eventEndHour: any;

  //Dia e hora do evento [SAVE DATABASE]
  eventDate: Date;

  //Contato selecionado [EVENTOS DE AMBIENTE]
  contactSelectedId: string;

  //Ambiente selecionado [EVENTOS DE CONTATO]
  roomSelectedId: string;

  //Define se o evento é o dia todo
  allDay: boolean = false;

  //Descrição
  description: string;

  constructor(public modalCtrl: ModalController, public toastCtrl: ToastController, private iab: InAppBrowser,
    public shared: SharedService, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    private socialSharing: SocialSharing) { }

  ngOnInit() {

    console.log("Ambiente: ", this.room);
    console.log("Evento: ", this.event);

    if (this.event) {

      this.event.startTime = this.event.startTime_firestore.toDate();
      this.event.endTime = this.event.endTime_firestore.toDate();

      this.contactSelectedId = this.event.contact.id;
      // this.title = this.event.title;
      this.description = this.event.descriptipon;
      this.allDay = this.event.allDay;
      this.eventDay = this.event.startTime;
      this.eventStartHour = this.event.startTime.toISOString();
      this.eventEndHour = this.event.endTime.toISOString();

      this.event.contact = this.shared.contacts.find((contact) => {
        return contact.id == this.contactSelectedId;
      })
      console.log("Contato do evento: ", this.event.contact);

      this.event.room = this.shared.rooms.find((room) => {
        return room.id == this.event.room.id;
      })
      console.log("Ambiente do evento: ", this.event.room);

    }

  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  sendNotification(type: 'sms' | 'whatsapp' | 'app') {

    this.isValidForm().then((res) => {

      //Formulário é válido
      if (res) {
        console.log("Chamar whatsapp:");


        let hour: any = this.event.startTime_firestore.toDate().getHours();
        hour = ("0" + hour).slice(-2);
        let minutes: any = this.event.startTime_firestore.toDate().getMinutes();
        minutes = ("0" + minutes).slice(-2);

        let day: any = this.event.startTime_firestore.toDate().getDate();
        day = ("0" + day).slice(-2);
        let month: any = this.event.startTime_firestore.toDate().getUTCMonth() + 1;
        month = ("0" + month).slice(-2);
        let year: any = this.event.startTime_firestore.toDate().getUTCFullYear();
        year = ("0" + year).slice(-2);

        let msg = `Bom dia, ${this.event.contact.name}! Passando aqui pra lembrar que você tem uma reserva no Coworking Parquelândia no(a) ${this.event.room.name}, no dia ${day}/${month}/${year} às ${hour}:${minutes}! Esperamos por você!`;
        let number = removeSymbol(this.event.contact.cellphone);

        // msg = encodeURI(msg);

        let number_with_prefix_br = '55' + number;

        console.log("Mensagem a enviar: ", msg);
        console.log("Número a enviar: ", number);

        if (type == 'whatsapp') {
          this.socialSharing.shareViaWhatsAppToReceiver(number_with_prefix_br, msg).then((res) => {
            console.log("Deu certo o compartilhamento");
          })
            .catch((err) => {
              console.error("Deu error o compartilhamento");
            })
        }
        else {

          this.socialSharing.shareViaSMS(msg, number_with_prefix_br).then((res) => {
            console.log("Mensagem enviada com sucesso..");
          }).catch((error) => {
            console.log("erro ao enviar SMS", error);
          })

          // this.shared.sendSms(number, msg).subscribe(async (res) => {
          //   console.log("SMS enviado com sucesso", res);
          //   let toast = await this.toastCtrl.create({
          //     message: 'SMS enviado com sucesso',
          //     duration: 1000
          //   })
          //   toast.present();
          // }, error => {
          //   console.error("Ocorreu algum erro ao enviar SMS", error);
          // })
        }

      }

    })
  }


  async isValidForm(): Promise<any> {

    console.log("Init isValid Form");

    return new Promise(async (resolve) => {

      console.log("Init new Promise")

      if (this.room && !this.contactSelectedId) {

        console.log("OPS!! Vc não tem contato selecionado");

        let alert = await this.alertCtrl.create({
          header: "Ops!",
          message: "Você precisa selecionar um contato",
          buttons: ['OK']
        })
        alert.present();
        resolve(false);
        return;
      }

      if (!this.eventDay) {
        let alert = await this.alertCtrl.create({
          header: "Ops!",
          message: "Você precisa selecionar o dia do evento",
          buttons: ['OK']
        })
        alert.present();
        resolve(false);
        return;
      }

      if (!this.eventStartHour && !this.allDay) {
        let alert = await this.alertCtrl.create({
          header: "Ops!",
          message: "Você precisa selecionar a hora de início do evento",
          buttons: ['OK']
        })
        alert.present();
        resolve(false);
        return;
      }

      if (!this.eventEndHour && !this.allDay) {
        let alert = await this.alertCtrl.create({
          header: "Ops!",
          message: "Você precisa selecionar a hora de fim do evento",
          buttons: ['OK']
        })
        alert.present();
        resolve(false);
        return;
      }

      if (!this.allDay) {
        let start = new Date(this.eventStartHour).getTime();
        let end = new Date(this.eventEndHour).getTime();

        if (start > end) {
          let alert = await this.alertCtrl.create({
            header: "Ops!",
            message: "A hora final deve ser posterior da hora inicial",
            buttons: ['OK']
          })
          alert.present();
          resolve(false);
          return;
        }
      }

      resolve(true);

    })



  }


  async save() {

    this.isValidForm().then((res) => {

      console.log("Res isValid:", res);

      //Formulário válido
      if (res === true) {

        console.log("Formulário é valido, vishi");

        //Evento BD
        let event: Event = {};

        //ID do evento
        if (this.event) {
          event.id = this.event.id;
        }

        //Título do evento
        // event.title = this.title;

        //Descrição do evento
        if (this.description) event.descriptipon = this.description;

        //Se o evento é o dia todo
        event.allDay = this.allDay;

        if (event.allDay) {
          let start: Date = new Date(this.eventDay);
          start.setHours(8, 0);
          let end: Date = new Date(this.eventDay);
          end.setHours(22, 0);

          event.startTime_firestore = firestore.Timestamp.fromDate(start);
          event.endTime_firestore = firestore.Timestamp.fromDate(end);
        }
        else {
          //Formatar início do evento com dia e horário selecionado
          let start: Date = new Date(this.eventDay);
          console.log("start antes: ", start);
          start.setHours(new Date(this.eventStartHour).getHours());
          start.setMinutes(new Date(this.eventStartHour).getMinutes());
          console.log("start dps: ", start);

          //Formatar fim do evento com dia e horário selecionado
          let end: Date = new Date(this.eventDay);
          console.log("end antes: ", end);
          end.setHours(new Date(this.eventEndHour).getHours());
          end.setMinutes(new Date(this.eventEndHour).getMinutes());
          console.log("end antes: ", start);

          event.startTime_firestore = firestore.Timestamp.fromDate(start);
          event.endTime_firestore = firestore.Timestamp.fromDate(end);
        }

        console.log("event.startTime_firestore : ", event.startTime_firestore);
        console.log("event.endTime_firestore: ", event.endTime_firestore);


        let contact = this.shared.contacts.find((c: Contact) => {
          return c.id == this.contactSelectedId;
        })

        if (contact) {
          event.contact_name = contact.name;
        }

        //Atualizar evento
        if (!this.event) {
          this.addEventOnDatabase(event);
        }
        //Criar novo evento
        else {
          this.updateEventOnDatabase(event);
        }

      }

    })

  }

  async addEventOnDatabase(event) {

    console.log("Evento criado: ", event);

    let loading = await this.loadingCtrl.create({})
    loading.present();

    Event.add(event, [
      {
        relationship: User.events,
        id: this.shared.user.id,
      },
      {
        relationship: Contact.events,
        id: this.contactSelectedId
      },
      {
        relationship: Room.events,
        id: this.roomSelectedId || this.room.id,
      }
    ]).subscribe(async () => {
      console.log("Evento adicionado com sucesso");
      let toast = await this.toastCtrl.create({
        message: 'Evento foi criado com sucesso',
        duration: 800
      })
      toast.present();
      loading.dismiss();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Algum erro ocorreu", error);
      loading.dismiss();
    })

  }

  async updateEventOnDatabase(event) {

    console.log("Evento atualizado: ", event);

    let loading = await this.loadingCtrl.create({})
    loading.present();

    Event.update(event.id, event, [
      {
        relationship: Contact.events,
        id: this.contactSelectedId
      }
    ]).subscribe(async () => {
      console.log("Evento atualizado com sucesso");
      let toast = await this.toastCtrl.create({
        message: 'Evento foi criado com sucesso',
        duration: 800
      })
      toast.present();
      loading.dismiss();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Algum erro ocorreu", error);
      loading.dismiss();
    })

  }

  dateSelected(ev) {
    console.log("Data selecionada: ", ev);
    this.eventDay = ev;
  }

  public remove() {
    Event.remove(this.event.id).subscribe(async () => {
      console.log("Evento removido com sucesso");
      let toast = await this.toastCtrl.create({
        message: `Evento removido`,
        duration: 800
      })
      toast.present();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Erro ao remover evento", error);
    })
  }

  async delete() {
    if (!this.event) return;

    let alert = await this.alertCtrl.create({
      header: 'Remoção de Evento',
      message: `Você certeza que deseja remover esse evento?`,
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.remove();
          }
        }
      ]
    })
    alert.present();
  }

}