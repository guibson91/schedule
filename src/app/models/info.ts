import { Collection } from '../firestore/collection';

export class Info extends Collection {

    static path = "info"

    text: string;

}