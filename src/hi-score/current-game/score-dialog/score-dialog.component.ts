import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

/**
 * Component made for editing the round score of a player in a dialog
 *
 * @export
 * @class ScoreDialogComponent
 */
@Component({
  selector: 'hs-score-dialog',
  templateUrl: 'score-dialog.component.html',
  styleUrls: ['score-dialog.component.scss']
})
export class ScoreDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public score: number
  ) { }

  /**
   * Change the score by adding the value in parameter
   *
   * @param {number} addedScore
   * @memberof ScoreDialogComponent
   */
  public modifyScore(addedScore: number): void {
    this.score += addedScore;
  }
}
