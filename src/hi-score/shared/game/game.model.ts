import { Score } from '../score/score.model';
import { GameCategory } from '../game-category/game-category.model';

export class Game {
  public id: string;
  public gameCategory: GameCategory;
  public date: Date;
  public isGameContinuing: boolean;
  public firstPlayerList: string[];
  public scoreList: Score[];
}
