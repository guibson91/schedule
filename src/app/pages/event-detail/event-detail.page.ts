import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { flatMap, first } from 'rxjs/operators';
import { Event } from '../../models/event';
import { SharedService } from '../../services/shared.service';
import { Contact } from '../../models/contact';
import { Room } from '../../models/room';
import { EventCreatePage } from '../event-create/event-create.page';


@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  //Título da página
  titleDate: Date;

  contactId: string;
  contact: Contact;

  roomId: string;
  room: Room;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  //Array de eventos
  eventSource = []

  type: string = 'month';

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(public modalCtrl: ModalController, public toastCtrl: ToastController, public alertCtrl: AlertController,
    public route: ActivatedRoute, public shared: SharedService) {

  }

  ngOnInit() {

    this.shared.nowSubject$.subscribe(() => {
      console.log("Atualizar para HOJE");
      this.today();
    })

    this.route.paramMap.pipe(flatMap((params: ParamMap) => {
      this.contactId = params.get('contactId');
      this.roomId = params.get('roomId');

      console.log("Contato Id: ", this.contactId);
      console.log("Room id ", this.roomId);

      if (this.contactId) {
        Contact.object(this.contactId).pipe(first()).subscribe((contact) => {
          this.contact = contact;
        })
      }

      if (this.roomId) {
        Room.object(this.roomId).pipe(first()).subscribe((room) => {
          this.room = room;
        })
      }

      if (this.contactId) return Event.list([
        {
          name: 'user.id',
          operator: '==',
          value: this.shared.user.id
        },
        {
          name: 'contact.id',
          operator: '==',
          value: this.contactId
        }
      ])
      else return Event.list([
        {
          name: 'user.id',
          operator: '==',
          value: this.shared.user.id
        },
        {
          name: 'room.id',
          operator: '==',
          value: this.roomId
        }
      ])
    }))
      .subscribe((events: Event[]) => {

        this.eventSource = [];

        console.log("Eventos: ", events);

        events.forEach(event => {
          let eventCopy = {
            startTime: event.startTime_firestore.toDate(),
            startTime_firestore: event.startTime_firestore,

            endTime: event.endTime_firestore.toDate(),
            endTime_firestore: event.endTime_firestore,

            allDay: event.allDay,
            contact: event.contact,
            room: event.room,
            id: event.id,
            contact_name: event.contact_name,
            room_name: event.room_name,
            title: event.contact_name,
            desc: event.descriptipon,
            description: event.descriptipon

          };
          this.eventSource.push(eventCopy);
          // this.addEvent(event)
        });

        this.myCal.loadEvents();

      })
  }

  segmentChanged() {
    this.calendar.mode = this.type;
  }

  // Create the right event format and reload source
  // addEvent(event: Event) {
  //   let eventCopy = {
  //     title: event.title,
  //     desc: event.description,
  //     startTime: event.start.toDate(),
  //     endTime: event.end.toDate(),
  //     allDay: event.allDay,
  //     contact: event.contact,
  //     room: event.room,
  //     id: event.id,
  //     contact_name: event.contact_name,
  //     room_name: event.room_name
  //   }
  //   this.eventSource.push(eventCopy);
  // }


  // Change current month/week/day
  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

  // Focus today
  today() {
    this.calendar.currentDate = new Date();
    this.titleDate = this.calendar.currentDate;
  }

  onCurrentDateChanged() {
    console.log("Data selecionada: ", this.myCal.calendarService.currentDate);
    this.titleDate = this.myCal.calendarService.currentDate;
  }


  // Calendar event was clicked
  async onEventSelected(event) {

    let modal = await this.modalCtrl.create({
      component: EventCreatePage,
      componentProps: {
        event: event,
        room: this.room
      }
    })
    modal.present();
  }

  async add() {

    if (!this.shared.contacts || this.shared.contacts.length <= 0) {
      let alert = await this.alertCtrl.create({
        header: 'Sem contatos',
        message: 'Você precisa cadastrar pelo menos um contato para criar eventos.',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    let modal = await this.modalCtrl.create({
      component: EventCreatePage,
      componentProps: {
        // contact: this.contact || null,
        room: this.room || null
      }
    });
    modal.present();
  }

}