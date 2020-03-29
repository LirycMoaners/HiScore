import { BehaviorSubject, Observable, from } from 'rxjs';
import { first, tap, map } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { firestore } from 'firebase';

import { FirestoreElement } from '../../shared/models/firestore-element.model';
import { AuthenticationService } from './authentication.service';

/**
 * Class to extend for all services link to Firestore
 *
 * @export
 */
export class FirstoreService<T extends FirestoreElement> {

 /**
  * Subject of all the elements
  */
 public elementListSubject: BehaviorSubject<T[]>;

 /**
  * FirebaseElementhe function to unsubscribe to the element checking from database
  */
 private elementListUnsubscribe: () => void;

 constructor(
   protected readonly authenticationService: AuthenticationService,
   protected readonly elementNameInLocalStorage: string,
   protected readonly firestoreCollection: () => firestore.CollectionReference,
   firestoreQuery: () => firestore.Query,
   mapFunctionAfterGetFromLocalStorage = (element: T) => element,
   sortFunctionAfterGetFromLocalStorage: (element1: T, element2: T) => number = () => 0,
   mapFunctionAfterGetFromFirebase = (element: T) => element,
   mapFunctionBeforePushToFirestore = (element: T) => element
 ) {
   this.initElementListSubject(mapFunctionAfterGetFromLocalStorage, sortFunctionAfterGetFromLocalStorage);

   firebase.auth().onAuthStateChanged((user) => {
     if (user) {
       this.syncElements(
          firestoreCollection,
          firestoreQuery,
          mapFunctionAfterGetFromFirebase,
          mapFunctionBeforePushToFirestore
        );
     } else if (this.elementListUnsubscribe) {
       this.stopSyncElements();
     }
   });
 }

  /**
   * Get an observable of a element find by its id
   */
  public getElementById(id: string): Observable<T> {
    return this.elementListSubject.pipe(
      first(),
      map((elementList: T[]) => elementList.find((element: T) => element.id === id))
    );
  }

  /**
   * Return an observable of a element list filtered by a list of ids
   */
  public getElementListById(idList: string[]): Observable<T[]> {
    return this.elementListSubject.pipe(
      first(),
      map((elementList: T[]) =>
        idList.map((id: string) => elementList.find((element: T) => element.id === id))
      )
    );
  }

  /**
   * Create a new element
   */
  public createElement(element: T): Observable<void> {
    element.isSynced = !!this.authenticationService.user;
    if (!element.isSynced) {
      return this.elementListSubject.pipe(
        first(),
        map((elementList: T[]) => {
          elementList.unshift(element);
          localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elementList));
        })
      );
    } else {
      return from(this.firestoreCollection().doc(element.id).set({...element}));
    }
  }

  /**
   * Create multiple new elements
   */
  public createElementList(newElementList: T[]): Observable<void> {
    newElementList = newElementList.map(element => {
      element.isSynced = !!this.authenticationService.user;
      return element;
    });
    if (!newElementList[0].isSynced) {
      return this.elementListSubject.pipe(
        first(),
        map((elementList: T[]) => {
          elementList.unshift(...newElementList);
          localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elementList));
        })
      );
    } else {
      return from(
        newElementList.map(element => {
          this.firestoreCollection().doc(element.id).set({...element});
        })
      );
    }
  }

  /**
   * Modify a element
   */
  public updateElement(newElement: T): Observable<void> {
    newElement.isSynced = !!this.authenticationService.user;
    if (!newElement.isSynced) {
      return this.elementListSubject.pipe(
        first(),
        map((elementList: T[]) => {
          const oldElement: T = elementList.find((element: T) => element.id === newElement.id);
          elementList.splice(elementList.indexOf(oldElement), 1, newElement);
          localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elementList));
        })
      );
    } else {
      return from(
        this.firestoreCollection().doc(newElement.id).set({...newElement}, { merge: true })
      );
    }
  }

  /**
   * Initialize the elementListSubject with the local storage
   */
  private initElementListSubject(
    mapFunction: (element: T) => T,
    sortFuntion: (element1: T, element2: T) => number
  ) {
    const elements: T[] = (JSON.parse(localStorage.getItem(this.elementNameInLocalStorage)) || [])
      .map(mapFunction)
      .sort(sortFuntion) || [];
    this.elementListSubject = new BehaviorSubject<T[]>(elements);
  }

  /**
   * Push all not synced elements and begin check updates from database
   */
  private syncElements(
    firestoreCollection: () => firestore.CollectionReference,
    firestoreQuery: () => firestore.Query,
    mapFunction: (element: T) => T,
    mapFunctionBeforePush: (element: T) => T
  ) {
    if (!this.elementListUnsubscribe) {
      this.pushNotSyncedElements(firestoreCollection, mapFunctionBeforePush).subscribe(() => {
        this.elementListUnsubscribe = firestoreQuery().onSnapshot((querySnapshot) => {
            let elements = [];
            querySnapshot.forEach((doc) => elements.push(doc.data()));
            elements = elements.map(mapFunction);
            localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elements));
            this.elementListSubject.next(elements);
          });
      });
    }
  }

  /**
   * Push all not synced elements to the database
   */
  private pushNotSyncedElements(
    firestoreCollection: () => firestore.CollectionReference,
    mapFunction: (element: T) => T
  ) {
    return this.elementListSubject.pipe(
      first(),
      tap(async elementList => {
        const notSyncedanyList = elementList
          .filter(element => !element.isSynced)
          .map(element => {
            element.isSynced = true;
            return element;
          })
          .map(mapFunction);
        for (const element of notSyncedanyList) {
          await firestoreCollection().doc(element.id).set({...element}, { merge: true });
        }
      })
    );
  }

  /**
   * Stop checking database updates
   */
  private stopSyncElements() {
    this.elementListUnsubscribe();
    this.elementListUnsubscribe = null;
  }
}
