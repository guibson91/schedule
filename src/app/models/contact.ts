import { Collection } from 'src/app/firestore/collection';
import { UserContact } from './relationships/user-contact';
import { ContactEvent } from './relationships/contact-event';
import { Event } from './event';
import { RelationshipField } from '../firestore/collection-relationship';

export class Contact extends Collection {

    static path = "contacts"

    //Relacionamentos MANY
    public static get events() {
        return new ContactEvent<Event>(Contact)
    }

    //Relacionamentos ONE
    user?: RelationshipField;

    //Dados salvos no banco de dados
    name?: string;

    role?: string;

    image?: string;

    email?: string;

    phone?: string;

    cellphone?: string;

}