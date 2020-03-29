import { Score } from './score.model';
import { GameCategory } from './game-category.model';
import { FirestoreElement } from './firestore-element.model';

export class Game extends FirestoreElement {
  public gameCategory: GameCategory;
  public date: Date;
  public isFirstPlayerRandom: boolean;
  public isGameEnd: boolean;
  public firstPlayerList: string[];
  public scoreList: Score[];
  public creatorId: string;
}
