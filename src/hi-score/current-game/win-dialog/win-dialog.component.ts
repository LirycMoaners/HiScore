import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Game } from '../../shared/game/game.model';
import { Score } from '../../shared/score/score.model';
import { Goal } from '../../shared/game-category/goal.enum';

/**
 * Component made for showing the end of a game in a dialog
 *
 * @export
 * @class WinDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'hs-win-dialog',
  templateUrl: 'win-dialog.component.html',
  styleUrls: ['win-dialog.component.scss']
})
export class WinDialogComponent implements OnInit {
  /**
   * Identify if the user wants to leave the game or to continue the game
   *
   * @memberof WinDialogComponent
   */
  public isLeaving = true;

  /**
   * The ordered score list of the current game
   *
   * @type {Score[]}
   * @memberof WinDialogComponent
   */
  public orderedScoreList: Score[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public game: Game
  ) { }

  ngOnInit() {
    this.orderedScoreList = Object.assign([], this.game.scoreList);

    if (this.game.gameCategory.goal === Goal.highestScore) {
      this.orderedScoreList.sort((scoreA: Score, scoreB: Score) => scoreB.total - scoreA.total);
    } else {
      this.orderedScoreList.sort((scoreA: Score, scoreB: Score) => scoreA.total - scoreB.total);
    }
  }
}
