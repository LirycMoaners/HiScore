import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component made for editing the round score of a player in a dialog
 *
 * @export
 */
@Component({
  selector: 'app-score-dialog',
  templateUrl: 'score-dialog.component.html',
  styleUrls: ['score-dialog.component.scss']
})
export class ScoreDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public score: number
  ) { }

  /**
   * Change the score by adding the value in parameter
   */
  public modifyScore(addedScore: number): void {
    this.score = Number(this.score) + addedScore;
  }
}
