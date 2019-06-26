import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Room } from '../../models/room';
import { NavController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { SharedService } from '../../services/shared.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-room-register',
  templateUrl: './room-register.page.html',
  styleUrls: ['./room-register.page.scss'],
})
export class RoomRegisterPage implements OnInit {

  form: FormGroup;

  showError: boolean;

  @Input() room: Room

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController, public shared: SharedService, public toastCtrl: ToastController) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(1)])
    })

    console.log("Ambiente: ", this.room);
    if (this.room) {
      this.form.patchValue(this.room);
    }

  }

  async save() {
    if (!this.form.valid) {
      this.showError = true;
      return;
    }
    else {
      this.showError = false;
    }

    //Adicionar novo ambiente
    if (!this.room) {
      this.add();
    }
    //Atualizar ambiente
    else {
      this.update();
    }
  }

  async add() {
    let data = this.form.value;
    data.name = String(data.name).toUpperCase();
    console.log("Salvar ambiente: ", data);
    console.log("Usuário logado: ", this.shared.user)

    let loading = await this.loadingCtrl.create({})
    loading.present();

    Room.add(data, [{
      relationship: User.rooms,
      id: this.shared.user.id
    }]).subscribe(async () => {
      console.log("Ambiente adicionado com sucesso");
      let name = data.name.toUpperCase();
      let toast = await this.toastCtrl.create({
        message: `<b>${name}</b> foi adicionado`,
        duration: 800
      })
      toast.present();
      this.modalCtrl.dismiss();
      loading.dismiss();
    }, error => {
      console.error("Erro ao adicionar ambiente", error);
      loading.dismiss();
    })
  }

  async update() {
    let data = this.form.value;
    data.name = String(data.name).toUpperCase();
    console.log("Salvar usuário: ", data);

    let loading = await this.loadingCtrl.create({})
    loading.present();

    Room.update(this.room.id, data).subscribe(async () => {
      console.log("Ambiente adicionado com sucesso");
      let name = data.name.toUpperCase();
      let toast = await this.toastCtrl.create({
        message: `<b>${name}</b> foi adicionado`,
        duration: 800
      })
      toast.present();
      this.modalCtrl.dismiss();
      loading.dismiss();
    }, error => {
      console.error("Erro ao adicionar ambiente", error);
      loading.dismiss();
    })
  }

  public remove() {
    Room.remove(this.room.id).subscribe(async () => {
      console.log("Ambiente foi removido com sucesso");
      let name = this.room.name.toUpperCase();
      let toast = await this.toastCtrl.create({
        message: `<b>${name}</b> foi adicionado`,
        duration: 800
      })
      toast.present();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Erro ao adicionar ambiente", error);
    })
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async delete() {
    if (!this.room) return;

    let alert = await this.alertCtrl.create({
      header: 'Remoção de Ambiente',
      message: `Você certeza que deseja remover <b>${this.room.name}</b>?`,
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