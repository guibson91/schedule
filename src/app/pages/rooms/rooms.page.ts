import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ModalController, AlertController } from '@ionic/angular';
import { RoomRegisterPage } from 'src/app/pages/room-register/room-register.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {

  constructor(public shared: SharedService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public router: Router,
    public ref: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  async add() {
    let modal = await this.modalCtrl.create({
      component: RoomRegisterPage
    });
    modal.present();
  }

  async edit(room) {
    let modal = await this.modalCtrl.create({
      component: RoomRegisterPage,
      componentProps: {
        room: room
      }
    });
    modal.present();
  }

  // async addEvent(room) {

  //   if (!this.shared.contacts || this.shared.contacts.length <= 0) {
  //     let alert = await this.alertCtrl.create({
  //       header: "Sem contato",
  //       message: "Você precisa ter pelo menos um contato cadastrado para criar um evento",
  //       buttons: ['OK']
  //     })
  //     alert.present();
  //     return;
  //   }

  //   let modal = await this.modalCtrl.create({
  //     component: EventCreatePage,
  //     componentProps: {
  //       room: room
  //     }
  //   });
  //   modal.present();
  // }

  openSchedule(room) {
    this.router.navigate(['/tabs/event-detail', {
      roomId: room.id
    }])
  }

}