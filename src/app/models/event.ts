import { Collection } from 'src/app/firestore/collection';
import { RelationshipField } from '../firestore/collection-relationship';
import { firestore } from "firebase"
import { Contact } from './contact';
import { Room } from './room';

export class Event extends Collection {

    static path = "events"

    //Relacionamentos ONE
    user?: RelationshipField;
    contact?: RelationshipField & Contact;
    room?: RelationshipField & Room;

    //Banco de Dados
    title?: string;
    descriptipon?: string;
    startTime_firestore?: firestore.Timestamp;
    endTime_firestore?: firestore.Timestamp;
    allDay?: boolean;
    contact_name?: string;
    room_name?: string;

    //View

    startTime?: Date;
    endTime?: Date;

}