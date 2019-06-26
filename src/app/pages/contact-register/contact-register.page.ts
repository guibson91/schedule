import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Contact } from '../../models/contact';
import { SharedService } from '../../services/shared.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-contact-register',
  templateUrl: './contact-register.page.html',
  styleUrls: ['./contact-register.page.scss'],
})
export class ContactRegisterPage implements OnInit {

  form: FormGroup;

  showError: boolean;

  @Input() contact: Contact

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController, public shared: SharedService, public toastCtrl: ToastController) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
      role: new FormControl(""),
      email: new FormControl("", [Validators.required, Validators.minLength(3), Validators.email]),
      phone: new FormControl(""),
      cellphone: new FormControl("", [Validators.required, Validators.minLength(14)]),
    })

    console.log("contato: ", this.contact);
    if (this.contact) {
      this.form.patchValue(this.contact);
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

    //Adicionar novo contato
    if (!this.contact) {
      this.add();
    }
    //Atualizar contato
    else {
      this.update();
    }
  }

  async add() {
    let data = this.form.value;
    data.name = String(data.name).toUpperCase();
    data.role = String(data.role).toUpperCase();

    let loading = await this.loadingCtrl.create({})
    loading.present();

    Contact.add(data, [{
      relationship: User.contacts,
      id: this.shared.user.id
    }]).subscribe(async () => {
      console.log("Contato adicionado com sucesso");
      let name = data.name.toUpperCase();
      let toast = await this.toastCtrl.create({
        message: `<b>${name}</b> foi adicionado`,
        duration: 800
      })
      toast.present();
      loading.dismiss();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Erro ao adicionar contato", error);
      loading.dismiss();
    })
  }

  async update() {
    let data = this.form.value;
    data.name = String(data.name).toUpperCase();
    console.log("Salvar usuário: ", data);

    let loading = await this.loadingCtrl.create({})
    loading.present();

    Contact.update(this.contact.id, data).subscribe(async () => {
      console.log("Contato atualizado com sucesso");
      let name = data.name.toUpperCase();
      let toast = await this.toastCtrl.create({
        message: `<b>${name}</b> foi atualizado`,
        duration: 800
      })
      toast.present();
      loading.dismiss();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Erro ao adicionar contato", error);
      loading.dismiss();
    })
  }

  public remove() {
    Contact.remove(this.contact.id).subscribe(async () => {
      console.log("Contato removido com sucesso");
      let name = this.contact.name.toUpperCase();
      let toast = await this.toastCtrl.create({
        message: `<b>${name}</b> foi removido`,
        duration: 800
      })
      toast.present();
      this.modalCtrl.dismiss();
    }, error => {
      console.error("Erro ao remover contato", error);
    })
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async delete() {
    if (!this.contact) return;

    let alert = await this.alertCtrl.create({
      header: 'Remoção de Contato',
      message: `Você certeza que deseja remover ${this.contact.name}?`,
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