import { Collection } from 'src/app/firestore/collection';
import { Event } from './event';
import { RoomEvent } from './relationships/room-event';
import { RelationshipField } from '../firestore/collection-relationship';

export class Room extends Collection {

    static path = "rooms"

    //Relacionamentos MANY
    public static get events() {
        return new RoomEvent<Event>(Room)
    }

    //Relacionamentos ONE
    user?: RelationshipField;

    //Dados salvos no banco de dados
    name?: string;

    description?: string;

    image?: string;

}