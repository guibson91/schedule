import { CollectionRelationship, RelationshipType } from '../../firestore/collection-relationship';
import { User } from '../user';
import { Contact } from 'src/app/models/contact';

export class UserContact<T> extends CollectionRelationship<T, {}>  {

    public get collection1() {
        return {
            collection: User,
            name: 'user',
            required: false
        }
    }

    public get collection2() {
        return {
            collection: Contact,
            name: 'contacts',
            required: false
        }
    }

    public type = RelationshipType.OneToMany

}