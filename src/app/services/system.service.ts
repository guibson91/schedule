import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(public alertCtrl: AlertController) {

  }

  public async showErrorAlert(error?, origin?: string) {

    console.error("Ocorreu um erro: ", error);

    if (origin && origin == 'logout') return;

    //Mensagem genérica para erro desconhecido ou não mapeado
    let title = 'Falha de comunicação!';
    let msg = 'Ocorreu uma falha de comunicação! Tente novamente mais tarde.';

    if (error && error.message) {
      title = "Ops!";
      msg = error.message;
    }
    else if (error) {
      title = "Ops!";
      msg = JSON.stringify(error);
    }

    if (error && error.title) {
      title = error.title;
    }

    if (msg == 'Missing or insufficient permissions.') {
      title = "Permissão inválida"
      msg = "Usuário não tem permissão para realizar essa ação! Por favor contate o administrador."
    }

    //Tratamento com base no código de erros específicos
    if (error && error.code == 'auth/account-exists-with-different-credential') {
      title = 'Conta já existe'
      msg = 'Uma conta já existe com o mesmo endereço de e-mail, mas credenciais de login diferentes. Faça login usando um provedor associado a este endereço de e-mail.'
    }
    else if (error && error.code == 'auth/popup-closed-by-user') {
      title = 'Erro de autenticação';
      msg = 'Janela fechada pelo usuário antes de concluir a autenticação. Tente novamente.'
    }
    else if (error && error.code == 'auth/email-already-exists') {
      title = 'Email já cadastrado';
      msg = 'Essa conta de email já foi cadastrada no painel administrativo ou no aplicativo. Por favor, escolha outro email e tente novamente.'
    }

    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: ['OK']
    });
    alert.present();

  }

}