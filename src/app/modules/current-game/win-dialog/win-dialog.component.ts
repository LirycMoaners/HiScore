import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

import { Score } from '../../../shared/models/score.model';
import { Game } from '../../../shared/models/game.model';
import { Goal } from '../../../shared/models/goal.enum';

/**
 * Component made for showing the end of a game in a dialog
 *
 * @export
 */
@Component({
  selector: 'app-win-dialog',
  templateUrl: 'win-dialog.component.html',
  styleUrls: ['win-dialog.component.scss']
})
export class WinDialogComponent implements OnInit {

  /**
   * Identify if the user wants to leave the game or to continue the game
   */
  public isLeaving = true;

  /**
   * The ordered score list of the current game
   */
  public orderedScoreList: Score[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {game: Game, isUserAdmin: boolean}
  ) { }

  ngOnInit() {
    this.orderedScoreList = Object.assign([], this.data.game.scoreList);

    if (this.data.game.gameCategory.goal === Goal.highestScore) {
      this.orderedScoreList.sort((scoreA: Score, scoreB: Score) => scoreB.total - scoreA.total);
    } else {
      this.orderedScoreList.sort((scoreA: Score, scoreB: Score) => scoreA.total - scoreB.total);
    }
  }
}
