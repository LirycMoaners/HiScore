import { Score } from './score.model';
import { GameCategory } from './game-category.model';

export class Game {
  public id: string;
  public gameCategory: GameCategory;
  public date: Date;
  public isFirstPlayerRandom: boolean;
  public isGameEnd: boolean;
  public firstPlayerList: string[];
  public scoreList: Score[];
  public creatorId: string;
  public isSynced: boolean;
}
