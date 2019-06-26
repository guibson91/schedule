import { CollectionRelationship, RelationshipType } from '../../firestore/collection-relationship';
import { Event } from '../event';
import { Contact } from 'src/app/models/contact';

export class ContactEvent<T> extends CollectionRelationship<T, {}>  {

    public get collection1() {
        return {
            collection: Contact,
            name: 'contact',
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