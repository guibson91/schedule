import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { SystemService } from '../../services/system.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  quantity_contacts: number;

  quantity_rooms: number;

  constructor(public shared: SharedService, public router: Router,
    public alertCtrl: AlertController, public authService: AuthService,
    public loadingCtrl: LoadingController, public system: SystemService,
    public ref: ChangeDetectorRef) {

  }

  ngOnInit() {

  }

  /**
    * Realizar o logout
    */
  public async logout() {
    let confirm = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Você tem certeza que deseja sair?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Confirmar',
          handler: async () => {

            let loading = await this.loadingCtrl.create();
            loading.present();
            this.authService.logout()
              .subscribe(() => {
                loading.dismiss()
                this.router.navigateByUrl('/login')
              }, err => {
                loading.dismiss()
                this.system.showErrorAlert(err)
              })
          }
        }
      ]
    });
    confirm.present();
  }

}