import { EndingType } from './ending-type.enum';
import { Goal } from './goal.enum';

export class GameCategory {
  public id: string;
  public name: string;
  public endingType: EndingType;
  public endingNumber: number;
  public goal: Goal;
}