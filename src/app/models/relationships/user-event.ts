import { CollectionRelationship, RelationshipType } from '../../firestore/collection-relationship';
import { User } from '../user';
import { Event } from '../event';

export class UserEvent<T> extends CollectionRelationship<T, {}>  {

    public get collection1() {
        return {
            collection: User,
            name: 'user',
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