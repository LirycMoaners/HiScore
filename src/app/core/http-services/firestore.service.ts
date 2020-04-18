import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, Subscription } from 'rxjs';
import { first, tap, map, flatMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

import { FirestoreElement } from '../../shared/models/firestore-element.model';

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
   * Boolean to know if the user is logged in
   */
  private isSignedIn = false;

  /**
   * Subcription to the element list for sync
   */
  private elementListSubscription: Subscription;

  constructor(
    protected readonly auth: AngularFireAuth,
    protected readonly elementNameInLocalStorage: string,
    protected readonly firestoreCollection: () => AngularFirestoreCollection<T>,
    protected readonly firestoreQuery: () => AngularFirestoreCollection<T>,
    protected readonly mapFunctionAfterGetFromLocalStorage = (element: T) => element,
    protected readonly sortFunctionAfterGetFromLocalStorage: (element1: T, element2: T) => number = () => 0,
    protected readonly mapFunctionAfterGetFromFirebase = (element: T) => element,
    protected readonly mapFunctionBeforePushToFirestore = (element: T) => element
  ) {
    this.initElementListSubject(this.mapFunctionAfterGetFromLocalStorage, this.sortFunctionAfterGetFromLocalStorage);

    this.auth.user.subscribe((user) => {
      if (user) {
        this.isSignedIn = true;
        this.syncElements(
          this.firestoreCollection,
          this.firestoreQuery,
          this.mapFunctionAfterGetFromFirebase,
          this.mapFunctionBeforePushToFirestore
        );
      } else {
        this.isSignedIn = false;
        if (this.elementListSubscription && !this.elementListSubscription.closed) {
          this.stopSyncElements();
        }
      }
    });
  }

  /**
   * Get an observable of a element find by its id
   */
  public getElementById(id: string): Observable<T> {
    return this.auth.user.pipe(
      flatMap(user => {
        if (user) {
          return this.firestoreCollection().doc<T>(id).valueChanges();
        } else {
          return this.elementListSubject.pipe(
            first(),
            map((elementList: T[]) => elementList.find((element: T) => element.id === id))
          );
        }
      })
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
    element.isSynced = this.isSignedIn;
    if (!element.isSynced) {
      return this.elementListSubject.pipe(
        first(),
        map((elementList: T[]) => {
          elementList.unshift(element);
          localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elementList));
        })
      );
    } else {
      element = [element].map(this.mapFunctionBeforePushToFirestore)[0];
      return from(
        this.firestoreCollection().doc(element.id).set({...element})
      );
    }
  }

  /**
   * Create multiple new elements
   */
  public createElementList(newElementList: T[]): Observable<void> {
    newElementList = newElementList.map(element => {
      element.isSynced = this.isSignedIn;
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
      newElementList = [...newElementList].map(this.mapFunctionBeforePushToFirestore);
      return from(
        newElementList.map(element => {
          this.firestoreCollection().doc(element.id).set({...element});
        })
      );
    }
  }

  /**
   * Modify an element
   */
  public updateElement(newElement: T): Observable<void> {
    newElement.isSynced = this.isSignedIn;
    if (!newElement.isSynced) {
      return this.elementListSubject.pipe(
        first(),
        map((elementList: T[]) => {
          const elementIndex: number = elementList.findIndex((element: T) => element.id === newElement.id);
          elementList.splice(elementIndex, 1, newElement);
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
   * Update all the elements isSynced to false
   */
  public unsyncAllElements(): Observable<void> {
    return this.elementListSubject.pipe(
      first(),
      map((elementList: T[]) => {
        elementList = elementList.map(element => {
          element.id = UUID.UUID();
          element.isSynced = false;
          return element;
        });
        localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elementList));
      })
    );
  }

  /**
   * Delete an element
   */
  public deleteElement(element: T): Observable<void> {
    if (!this.isSignedIn) {
      return this.elementListSubject.pipe(
        first(),
        map((elementList: T[]) => {
          const elementIndex: number = elementList.findIndex((el: T) => el.id === element.id);
          elementList.splice(elementIndex, 1);
          localStorage.setItem(this.elementNameInLocalStorage, JSON.stringify(elementList));
        })
      );
    } else {
      return from(
        this.firestoreCollection().doc(element.id).delete()
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
    firestoreCollection: () => AngularFirestoreCollection<T>,
    firestoreQuery: () => AngularFirestoreCollection<T>,
    mapFunction: (element: T) => T,
    mapFunctionBeforePush: (element: T) => T
  ) {
    if (!this.elementListSubscription || this.elementListSubscription.closed) {
      this.pushNotSyncedElements(firestoreCollection, mapFunctionBeforePush).subscribe(() => {
        this.elementListSubscription = firestoreQuery().snapshotChanges().subscribe(documentChangeActions => {
          let elements = [];
          documentChangeActions.forEach((documentChangeAction) => elements.push(documentChangeAction.payload.doc.data()));
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
    firestoreCollection: () => AngularFirestoreCollection<T>,
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
    this.elementListSubscription.unsubscribe();
  }
}
