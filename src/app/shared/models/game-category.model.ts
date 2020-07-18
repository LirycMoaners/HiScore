import { EndingType } from './ending-type.enum';
import { Goal } from './goal.enum';
import { FirestoreElement } from './firestore-element.model';

export class GameCategory extends FirestoreElement {
  public name = '';
  public endingType: EndingType = EndingType.none;
  public endingNumber = 0;
  public goal: Goal = Goal.highestScore;
}
