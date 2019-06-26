import { Contact } from '../models/contact';
import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Room } from '../models/room';
import { User } from '../models/user';
import { Info } from 'src/app/models/info';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  KEY_SMS_DEV: string = 'N71S60XIFINZZZZFJDVYKN0Z';


  contacts: Contact[];

  subscriptionContacts: Subscription;

  rooms: Room[];

  subscriptionRooms: Subscription;

  /**
   * Verifica se o usuário atual está autenticado
   */
  isLogged: boolean = false;

  /**
   * Diferença em milisegundos da hora atual do servidor e a hora atual local
   */
  offsetTime: number = 0;

  /**
   * ReplaySubject(Tipo de observable) que irá está sincronizado com as mudanças do usuário atual.
   */
  user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  nowSubject$: ReplaySubject<any> = new ReplaySubject<any>(1);

  /**
   * Subscription para requisição do usuário em tempo real
   */
  subscription_user: Subscription

  /**
   * Usuário logado
   */
  user: User;

  info: Info;

  constructor(public http: Http) {

    this.user$.subscribe((user) => {

      if (this.subscriptionRooms) this.subscriptionRooms.unsubscribe();
      if (this.subscriptionContacts) this.subscriptionContacts.unsubscribe();

      if (!user) {
        this.contacts = undefined;
        this.rooms = undefined;
        this.user = undefined;
        return;
      }

      this.user = user;

      this.subscriptionContacts = Contact.list([{
        name: 'user.id',
        operator: '==',
        value: user.id
      }]).subscribe((list) => {
        this.contacts = list;
        console.log("Contatos: ", this.contacts);
      })

      this.subscriptionRooms = Room.list([{
        name: 'user.id',
        operator: '==',
        value: user.id
      }]).subscribe((list) => {
        this.rooms = list;
        console.log("Salas: ", this.rooms);
      })

    })

    Info.object('1').subscribe((info: Info) => {
      this.info = info;
    })

  }

  /**
   * Sincroniza o usuário que está no banco de dados com o observable user$
   * @param id Id do usuário
   */
  realtimeUser(id: string) {
    if (this.subscription_user) this.subscription_user.unsubscribe()

    this.subscription_user = User.object(id).subscribe((user: User) => {
      console.log("Obtendo usuário..");
      if (user) {
        this.user$.next(user)
      } else {
        this.user$.next(null)
      }
    }, error => {
      this.user$.next(null);
      console.error("Usuário deslogado");
    })
  }

  /**
   * Enviar SMS via API do SMS DEV.
   * @param number número de telefone sem prefix de país. EX: 85996942049
   * @param msg mensagem encoded
   */
  sendSms(number: string, msg: string) {
    let url = 'http://api.smsdev.com.br/send?key=' + this.KEY_SMS_DEV + '&type=9&' + 'number=' + number + '&msg=' + msg;
    return this.http.get(url)
      .pipe(map(res => res.json()))
  }

}