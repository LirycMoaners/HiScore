import { EndingType } from './ending-type.enum';
import { Goal } from './goal.enum';
import { FirestoreElement } from './firestore-element.model';

export class GameCategory extends FirestoreElement {
  public name: string;
  public endingType: EndingType;
  public endingNumber: number;
  public goal: Goal;
}
