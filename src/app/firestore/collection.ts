import { Observable, Subject, from, of } from 'rxjs'
import { map, flatMap, first } from 'rxjs/operators'
import { CollectionRelationship, RelationshipType } from "./collection-relationship"
import { firestore } from "firebase"
import "firebase/firestore";
import { Batch } from "./batch"
import { fromQuerySnapshot, fromDocumentSnapshot, cleanObject } from './utils'

export abstract class Collection {
    /**
     * Path da entidade no firebase
     * @readonly
     */
    public static path?: string

    /**
     * Chave que é adquirida quando baixado a entidade do firebase.
     * @readonly
     */
    public id?: string

    /**
     * True if the snapshot contains the result of local writes (e.g. set() or
     * update() calls) that have not yet been committed to the backend.
     * If your listener has opted into metadata updates (via
     * `DocumentListenOptions` or `QueryListenOptions`) you will receive another
     * snapshot with `hasPendingWrites` equal to false once the writes have been
     * committed to the backend.
     */
    readonly hasPendingWrites?: boolean;

    /**
     * True if the snapshot was created from cached data rather than
     * guaranteed up-to-date server data. If your listener has opted into
     * metadata updates (via `DocumentListenOptions` or `QueryListenOptions`)
     * you will receive another snapshot with `fromCache` equal to false once
     * the client has received up-to-date data from the backend.
     */
    readonly fromCache?: boolean;

    /**
     * Referência para o collection de acordo com o firestore
     */
    public static get collection(): firestore.CollectionReference {
        if (!this.path) throw Error("Collection inicializada sem path")
        return firestore().collection(this.path)
    }

    /**
     * Listagem de todos os itens em tempo real
     * @param where Array de condições que serão utilizados na consulta
     * @param order Define como será a ordenação dos elementos consultados
     * @param limit Define o número máximo de elementos retornados
     * @param not_realtime Se true, a consulta não será em tempo real
     */
    public static list<T>(where?: WhereQuery[], order?: OrderQuery[], limit?: number, not_realtime?: boolean): Observable<T[]> {
        return this.request_list<T>(this.collection, where, order, limit, not_realtime)
    }

    /**
     * Listagem de todos os itens em tempo real
     * @param where Array de condições que serão utilizados na consulta
     * @param order Define como será a ordenação dos elementos consultados
     * @param limit Define o número máximo de elementos retornados
     * @param not_realtime Se true, a consulta não será em tempo real
     */
    public static request_list<T>(collection: firestore.CollectionReference, where?: WhereQuery[], order?: OrderQuery[], limit?: number, not_realtime?: boolean): Observable<T[]> {
        let query: firestore.Query = collection
        if (where) {
            for (let i = 0; i < where.length; i++) {
                query = query.where(where[i].name, where[i].operator, where[i].value)
            }
        }

        if (order) {
            for (let i = 0; i < order.length; i++) {
                if (order[i].type) query = query.orderBy(order[i].name, order[i].type)
                else query = query.orderBy(order[i].name)
            }
        }

        if (limit) {
            query = query.limit(limit)
        }

        if (not_realtime) {
            return from(query.get())
                .pipe(map(fromQuerySnapshot)).pipe(first())
        } else {
            let obs: Subject<any> = new Subject()
            query.onSnapshot(obs)
            return obs.pipe(map(fromQuerySnapshot))
        }

    }

    /**
     * Adicionar um novo elemento
     * @todo Checar se os relationships em cascata estão válidos
     * @param value Novo objeto a ser adicionado.
     * @param cascade_relationships Um array que define relacionamentos e suas respectivas chaves para serem adicionados em cascata.
     */
    public static add<T extends Collection>(obj: T, relationships?: CascadeRelationship[]): Observable<string> {
        // Demais relacionamentos
        const rel: CascadeRelationship[] = []
        if (relationships) {
            for (let relationship of relationships) {
                // Entidade Primária MANY E entidade secundária ONE (N1)
                //Apenas uma otimização para o objeto ser atualizado juntamente com sua relação
                if (relationship.relationship.type === RelationshipType.OneToMany &&
                    relationship.relationship.collection2.collection === this) {
                    obj[relationship.relationship.collection1.name] = {
                        id: relationship.id,
                        created: firestore.FieldValue.serverTimestamp()
                    }
                }
                //Demais relacionamentos (1N, NN, 11)
                else {
                    rel.push(relationship)
                }
            }
        }
        // Atribuir ao eu obj
        return from(this.collection.add(cleanObject(obj)))
            .pipe(map((document: firestore.DocumentReference) => {
                return document.id
            })).pipe(flatMap((id: string) => {
                if (rel && rel.length > 0) return new Batch().cascade(rel, id).commit().pipe(map(() => id))
                return of(id)
            }))
    }

    /**
     * Remover objeto do database
     * @param id chave do objeto a ser removido
     * @param relationships remover relacionamentos em cascata também
     */
    public static remove(id: string, relationships?: CascadeRelationship[]): Observable<any> {
        // if (!this.isValidCascade(relationships)) new Error("Não foram passados todos os relacionamentos requireds")
        let batch = new Batch()
        if (relationships && relationships.length > 0) {
            batch.cascade(relationships, id)
        }
        batch.write_batch.delete(this.collection.doc(id))
        return batch.commit()
    }

    /**
     * Update destrutivo(remove todo o objeto que existia antes e atribui ao novo)
     * @param id Id da entidade
     * @param obj Novo objeto
     */
    public static set<T>(id: string, obj: T): Observable<void> {
        return from(this.collection.doc(id).set(obj))
    }

    /**
     * Faz o merge entre os objetos dando prioridade ao objeto novo.
     * @param id id da entidade
     * @param obj novo objeto
     * @param relationships relacionamentos para serem adicionados
     */
    public static update<T>(id: string, obj: T, relationships?: CascadeRelationship[]): Observable<void> {
        let batch: Batch = new Batch()
        // Update de um documento
        if (obj)
            batch.write_batch.set(this.collection.doc(id), cleanObject(obj), { merge: true })
        // Update de uma lista de relacionamentos
        if (relationships) {
            batch.cascade(relationships, id)
        }
        return batch.commit()
    }

    /**
     * Obter um objeto do database
     * @param id id do objeto
     */
    public static object<T>(id: string, not_realtime?: boolean): Observable<T> {
        if (not_realtime) {
            return from(this.collection.doc(id).get())
                .pipe(map(fromDocumentSnapshot))
                .pipe(first())
        } else {
            let obs: Subject<any> = new Subject()
            this.collection.doc(id).onSnapshot(obs)
            return obs.pipe(map(fromDocumentSnapshot))
        }
    }

    /**
     * Dada uma lista de relacionamentos verifica se possuem todos os relacionamentos required.
     * @param relationships Array com a lista de relacionamentos a serem verificados
     */
    // private static isValidCascade(relationships: CascadeRelationship[]): boolean {
    //     throw Error("AInda não foi implementado verificador se relacionamentos em cascata estão válidos")
    // }


}

/**
 * Define o tipo de objeto que será passado como parâmetro para se atualizar
 * um array de relacionamentos.
 */
export interface CascadeRelationship {
    relationship: CollectionRelationship<any, any>,
    // Nova chave
    id?: string,
    // Na troca de relacionamento, remover o relacionamento antigo
    removeId?: string
}

/**
 * Define uma configuração de consulta que deve ser atendida.
 */
export interface WhereQuery {
    /**
     * Nome do atributo que será comparado
     */
    name: string

    /**
     * Operador de comparação
     */
    operator: "<" | "<=" | "==" | ">" | ">=",

    /**
     * Valor que será usado para comparar na consulta
     */
    value: any
}

/**
 * Estrutura que define uma ordenação
 */
export interface OrderQuery {
    /**
     * Nome do atributo
     */
    name: string

    /**
     * Se não for mandado esse atributo, o padrão é crescente
     * asc - crescente
     * desc - decrescente
     */
    type?: "asc" | "desc"
}