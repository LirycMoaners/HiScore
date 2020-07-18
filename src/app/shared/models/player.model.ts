import { FirestoreElement } from './firestore-element.model';
import { User } from '@firebase/auth-types';
import { UUID } from 'angular2-uuid';

export class Player extends FirestoreElement {
  public displayName: string | null = null;
  public photoURL: string | null = null;
  public isUser = false;

  constructor(user?: User) {
    super();
    if (user) {
      this.id = user.uid;
      this.isSynced = true;
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.isUser = true;
    } else {
      this.id = UUID.UUID();
    }
  }
}
