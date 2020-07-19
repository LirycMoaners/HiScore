import { UUID } from 'angular2-uuid';

export class FirestoreElement {
  id: string = UUID.UUID();
  isSynced = false;
}
