import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/**
 * Component made to choose the score of newly added players
 *
 * @export
 * @class NewPlayerScoreDialogComponent
 */
@Component({
  selector: 'hs-new-player-score-dialog',
  templateUrl: 'new-player-score-dialog.component.html',
  styleUrls: ['new-player-score-dialog.component.scss']
})
export class NewPlayerScoreDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<NewPlayerScoreDialogComponent>
  ) { }

  /**
   * Method to close the dialog and emit the score for new players
   *
   * @param {boolean} isNewPlayerScoreAverage
   * @memberof NewPlayerScoreDialogComponent
   */
  public closeDialog(isNewPlayerScoreAverage: boolean) {
    this.dialogRef.close(isNewPlayerScoreAverage);
  }
}
