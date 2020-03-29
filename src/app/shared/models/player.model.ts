import { FirestoreElement } from './firestore-element.model';

export class Player extends FirestoreElement {
  public name: string;
  public isUser: boolean;
}
