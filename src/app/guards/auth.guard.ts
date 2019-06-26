import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
  } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public loadingCtrl: LoadingController, private router: Router, public shared: SharedService, public auth: AuthService) {
    console.log("Auth Guard!! Vamos verificar autenticação...")
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    console.log("Entrando no canACtive...");
    return this.shared.user$
      .pipe(first())
      .pipe(map((user: User) => {

        console.log("Hello, aplicativo..");
        console.log("Usuário logado: ", user);
        //Usuário logado com sucesso
        if (user) {
          return true;
        }
        //Usuário não está logado
        else {
          this.router.navigateByUrl('/login')
          return false;
        }

      }))

  }

}