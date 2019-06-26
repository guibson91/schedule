import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { SystemService } from '../../services/system.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /**
  * Informações da conta a ser logada.
  */
  email: string = "";
  password: string = "";


  constructor(public navCtrl: NavController, public shared: SharedService,
    public authService: AuthService, public system: SystemService, private ref: ChangeDetectorRef,
    public loadingCtrl: LoadingController) {
    console.log("Init LoginPage")
  }

  ngOnInit() {
    this.ref.detectChanges();
  }

  /**
  * Realizar o login do usuário.
  */
  async doLogin() {
    let loading = await this.loadingCtrl.create({})
    loading.present();
    console.log("Do Login()");
    setTimeout(() => {
      this.ref.detectChanges();
    }, 10)
    console.log("Dados: ", this.email);
    this.authService.login(this.email, this.password)
      .subscribe(() => {
        loading.dismiss();
        this.navCtrl.navigateRoot('/tabs/rooms');
      }, (error: Error) => {
        loading.dismiss();
        this.system.showErrorAlert(error);
        this.ref.detectChanges()
      });
  }

}