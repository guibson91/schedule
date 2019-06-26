import { Collection } from '../firestore/collection';
import { Contact } from 'src/app/models/contact';
import { Event } from './event';
import { RelationshipField } from '../firestore/collection-relationship';
import { Room } from './room';
import { UserContact } from './relationships/user-contact';
import { UserEvent } from 'src/app/models/relationships/user-event';
import { UserRoom } from './relationships/user-room';

export class User extends Collection {

    static path = "users"

    //Relacionamentos MANY
    public static get events() {
        return new UserEvent<Event>(User)
    }
    public static get contacts() {
        return new UserContact<Contact>(User)
    }
    public static get rooms() {
        return new UserRoom<Room>(User)
    }

    //Dados salvos no banco de dados
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    permissions?: PermissionType[];
    push_notification?: { pushToken: string, userId: string };
}


/***********************************************************************
 * Permissão do usuário propriamente dita.
 * Responsável por mapear a permissão do usuário para um string correspondente.
 * Essa string que efetivamente será armazenada no banco de dados.
 ***********************************************************************/

export const Permission: {
    ADMIN: PermissionType, //Administração Master
} = {
    ADMIN: "ADMIN",
}

/**
 * Tipo de permissão de usuário
 * Deve ser utilizado para tipar uma variável 'permission'
 * Responsável em gerar o intellisense no typescript
 */
export type PermissionType = "ADMIN";