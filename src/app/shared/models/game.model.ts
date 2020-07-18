import { Score } from './score.model';
import { GameCategory } from './game-category.model';
import { FirestoreElement } from './firestore-element.model';

export class Game extends FirestoreElement {
  public gameCategory: GameCategory = new GameCategory();
  public date: Date | {seconds: number} = new Date();
  public isFirstPlayerRandom = false;
  public isGameEnd = false;
  public firstPlayerList: string[] = [];
  public scoreList: Score[] = [];
  public userIds: string[] = [];
  public adminIds: string[] = [];
}
