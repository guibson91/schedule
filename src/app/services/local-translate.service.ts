import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocalTranslateService {

  /**
    * Linguagens suportadas pela aplicação.
    */
  supported_languages: string[] = ['pt-br', 'en'];
  /**
   * Mensagens de erro a serem traduzidas
   */
  public INVALID_EMAIL: TranslatedString = {
    code: "INVALID_EMAIL"
  };
  public USER_DISABLED: TranslatedString = {
    code: "USER_DISABLED"
  };
  public USER_NOT_FOUND: TranslatedString = {
    code: "USER_NOT_FOUND"
  };
  public WRONG_PASSWORD: TranslatedString = {
    code: "WRONG_PASSWORD"
  };
  public RANDOM_ERROR: TranslatedString = {
    code: "RANDOM_ERROR"
  };
  public WEAK_PASSWORD: TranslatedString = {
    code: "WEAK_PASSWORD"
  };
  public USER_ALREADY_EXISTS: TranslatedString = {
    code: "USER_ALREADY_EXISTS"
  };

  constructor(private translate: TranslateService) {
    this.initializeTranslate();
    this.translateMessages();
  }
  /**
   * Inicializa o padrão de linguagem.
   * Utilizar pt-br como padrão, e tentar usar a linguagem do browser padrão como a linguagem atual.
   */
  initializeTranslate(): void {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('pt-br');

    // Verifica se existe linguagem no navegador, e se essa linguagem é suportada pela aplicação.
    if (this.translate.getBrowserLang() !== undefined &&
      this.supported_languages.indexOf(this.translate.getBrowserLang()) !== -1) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      // Se não existir linguagem padrão, usar Português.
      this.translate.use('pt-br');
    }
  }
  /**
   * Traduzindo as mensagens.
   */
  translateMessages(): void {
    this.translate.get([
      this.INVALID_EMAIL.code,
      this.USER_DISABLED.code,
      this.USER_NOT_FOUND.code,
      this.WRONG_PASSWORD.code,
      this.RANDOM_ERROR.code,
      this.WEAK_PASSWORD.code,
      this.USER_ALREADY_EXISTS.code
    ]).subscribe((translations) => {
      this.INVALID_EMAIL.message = translations[this.INVALID_EMAIL.code];
      this.USER_DISABLED.message = translations[this.USER_DISABLED.code];
      this.USER_NOT_FOUND.message = translations[this.USER_NOT_FOUND.code];
      this.WRONG_PASSWORD.message = translations[this.WRONG_PASSWORD.code];
      this.RANDOM_ERROR.message = translations[this.RANDOM_ERROR.code];
      this.WEAK_PASSWORD.message = translations[this.WEAK_PASSWORD.code];
      this.USER_ALREADY_EXISTS.message = translations[this.USER_ALREADY_EXISTS.code];
    });
  }

  /**
   * Traduz o erro do firebase
   * @param code código do error no firebase
   * 
   * Error Codes (err.code)
   * auth/invalid-email
   * Thrown if the email address is not valid.
   * auth/user-disabled
   * Thrown if the user corresponding to the given email has been disabled.
   * auth/user-not-found
   * Thrown if there is no user corresponding to the given email.
   * auth/wrong-password
   * Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set.
   * auth/email-already-in-use
   * Thrown if there already exists an account with the given email address.
   * auth/operation-not-allowed
   * Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
   * auth/weak-password
   * Thrown if the password is not strong enough.
   * auth/invalid-password
   * O valor fornecido para a propriedade de usuário password é inválido. Precisa ser uma string com pelo menos seis caracteres.
   */
  authError(code: string): Error {
    switch (code) {
      case "auth/invalid-email":
        return Error(this.INVALID_EMAIL.message);
      case "auth/user-disabled":
        return Error(this.USER_DISABLED.message);
      case "auth/user-not-found":
        return Error(this.USER_NOT_FOUND.message);
      case "auth/wrong-password":
        return Error(this.WRONG_PASSWORD.message);
      case "auth/email-already-in-use":
        return Error(this.USER_ALREADY_EXISTS.message);
      case "auth/weak-password":
      case "auth/invalid-password":
        return Error(this.WEAK_PASSWORD.message);
      default:
        console.error("Um erro aleatório aconteceu", code);
        return Error(this.RANDOM_ERROR.message);
    }
  }

}
/**
 * Interface da estrutura que possui o código e a tradução de cada mensagem.
 */
interface TranslatedString {
  code: string;
  message?: string
}