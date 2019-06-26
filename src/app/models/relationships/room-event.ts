import { CollectionRelationship, RelationshipType } from '../../firestore/collection-relationship';
import { Event } from '../event';
import { Room } from '../room';

export class RoomEvent<T> extends CollectionRelationship<T, {}>  {

    public get collection1() {
        return {
            collection: Room,
            name: 'room',
            required: false
        }
    }

    public get collection2() {
        return {
            collection: Event,
            name: 'events',
            required: false
        }
    }

    public type = RelationshipType.OneToMany

}