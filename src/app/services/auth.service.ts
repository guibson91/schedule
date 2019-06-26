import * as firebase from 'firebase';
import { auth } from 'firebase';
import {
  catchError,
  first,
  flatMap,
  switchMap,
  tap
  } from 'rxjs/operators';
import {
  combineLatest,
  from,
  Observable,
  of
  } from 'rxjs';
import { firebaseConfig } from '../../main';
import { Injectable } from '@angular/core';
import { LocalTranslateService } from './local-translate.service';
import { SharedService } from './shared.service';
import { SystemService } from './system.service';
import { User } from '../models/user';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
    * Auxiliar para gerar autenticação sem redirecionamento
    */
  otherAuthenticationApp: firebase.app.App;

  /**
   * Observable que fiscaliza a autenticação uma única vez
   */
  authState$: Observable<User>;

  constructor(public shared: SharedService, public translate: LocalTranslateService, public system: SystemService) {

    this.otherAuthenticationApp = firebase.initializeApp(firebaseConfig, 'otherAuthenticationApp');

    this.authState$ = this.initAuthState();

    // Verificação imediata de autenticação
    this.authState$.pipe(first()).subscribe()

  }

  /**
   * Observar mudanças na autenticação
   */
  initAuthState(): Observable<User> {
    console.log("Init initAuthState")
    return this.firebaseAuthState()
      .pipe(first())
      .pipe(flatMap((user: firebase.User) => {
        console.log("Retorno do firebaseAuthState", user);
        // Usuário logado.
        if (user) {
          this.shared.realtimeUser(user.uid)
          return User.object<User>(user.uid)
            .pipe(tap((u: User) => {
              if (u) {
                console.log("Existe usuário logado", u);
                this.shared.user$.next(u);
              } else {
                console.log("Não existe usuário logado");
                this.shared.user$.next(null);
              }
            }));
        }
        // Usuário deslogado.
        else {
          this.shared.user$.next(null);
          return of(null);
        }
      }))
      .pipe(tap((data) => {
        if (data) {
          this.shared.isLogged = true;
        } else {
          this.shared.isLogged = false;
        }
      }));
  }

  /**
   * Realizar o login do usuário.
   * @param email Email do usuário.
   * @param password Senha do usuário.
   * @returns Um observable que tenta o login do usuário.  
   */
  login(email: string, password: string): Observable<User> {
    return from(auth().signInWithEmailAndPassword(email, password))
      .pipe(catchError((err: any) => {
        throw this.translate.authError(err.code)
      })).pipe(flatMap(() => {
        return this.authState$.pipe(first());
      }));
  }

  /**
   * Criar um novo usuário.
   * @param email Email do usuário.
   * @param password Senha do usuário.
   */
  register(email: string, password: string): Observable<string> {
    return Observable.create(observer => {
      this.otherAuthenticationApp.auth().createUserWithEmailAndPassword(email, password)
        .then((authData: auth.UserCredential) => {
          observer.next(authData.user.uid);
        }).catch((err: any) => {
          observer.error(this.translate.authError(err.code))
          console.error("Ocorreu um erro", err);
        });
    });
  }

  /**
   * Atualiza o "email" e "password" de autenticação
   * @param emailOld Email no início da atualização
   * @param passwordOld Password no início da atualização
   * @param email Email no final da atualização
   * @param password Password no final da atualização
   */
  update(emailOld: string, passwordOld: string, email: string, password: string): Observable<any> {

    if (emailOld == email && passwordOld == password) {
      return of("Email e password são os mesmos. Não houve alteração de autenticação");
    }

    return Observable.create(observer => {
      this.otherAuthenticationApp.auth().signInWithEmailAndPassword(emailOld, passwordOld).then((authData: auth.UserCredential) => {
        observer.next(authData);
      }).catch(err => {
        this.system.showErrorAlert(err);
        observer.error(err);
      });
    }).flatMap((authData: auth.UserCredential) => {
      var email$: Observable<string>;
      if (emailOld != email) {
        email$ = Observable.create(observer => {
          authData.user.updateEmail(email).then(() => {
            observer.next("Email de autenticação foi alterado com sucesso");
          }).catch(err => {
            this.system.showErrorAlert(err);
            observer.error("Erro ao tentar alterar o email de autenticação");
          });
        });
      }
      var password$: Observable<string>;
      if (passwordOld != password) {
        password$ = Observable.create(observer => {
          authData.user.updatePassword(password).then(() => {
            observer.next("Password de autenticação foi alterado com sucesso");
          }).catch(err => {
            this.system.showErrorAlert(err);
            observer.error("Erro ao tentar alterar o password de autenticação");
          });
        });
      }
      return combineLatest([
        (email$ || "Email não foi alterado"),
        (password$ || "Password não foi alterado"),
      ]);
    });
  }


  private firebaseAuthState(): Observable<firebase.User> {
    return Observable.create((observer) => {
      auth().onAuthStateChanged(observer)
    })
  }

  /**
   * Realizar o logout do usuário atual.
   */
  logout(): Observable<string> {
    return Observable.create(observer => {

      auth().signOut().then(() => {
        observer.next("success");
      }).catch(err => {
        observer.error(err);
      });
    })
      .pipe(switchMap(() => {
        return this.authState$.pipe(first())
      }))
  }

}