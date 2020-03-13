import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component made to choose the score of newly added players
 *
 * @export
 */
@Component({
  selector: 'app-new-player-score-dialog',
  templateUrl: 'new-player-score-dialog.component.html',
  styleUrls: ['new-player-score-dialog.component.scss']
})
export class NewPlayerScoreDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<NewPlayerScoreDialogComponent>
  ) { }

  /**
   * Method to close the dialog and emit the score for new players
   */
  public closeDialog(isNewPlayerScoreAverage: boolean) {
    this.dialogRef.close(isNewPlayerScoreAverage);
  }
}
