import { CollectionRelationship, RelationshipType } from '../../firestore/collection-relationship';
import { User } from '../user';
import { Room } from '../room';

export class UserRoom<T> extends CollectionRelationship<T, {}>  {

    public get collection1() {
        return {
            collection: User,
            name: 'user',
            required: false
        }
    }

    public get collection2() {
        return {
            collection: Room,
            name: 'rooms',
            required: false
        }
    }

    public type = RelationshipType.OneToMany

}