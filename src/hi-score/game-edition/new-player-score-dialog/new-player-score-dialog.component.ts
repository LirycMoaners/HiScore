import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'hs-new-player-score-dialog',
  templateUrl: 'new-player-score-dialog.component.html',
  styleUrls: ['new-player-score-dialog.component.scss']
})

export class NewPlayerScoreDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<NewPlayerScoreDialogComponent>
  ) { }

  public closeDialog(isNewPlayerScoreAverage: boolean) {
    this.dialogRef.close(isNewPlayerScoreAverage);
  }
}
