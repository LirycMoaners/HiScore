import { Player } from './player.model';

export class Score {
  public player: Player = new Player();
  public roundScoreList: number[] = [];
  public total = 0;
}
