import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ks-score-dialog',
  templateUrl: 'score-dialog.component.html',
  styleUrls: ['score-dialog.component.scss']
})

export class ScoreDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public score: number
  ) { }

  public modifyScore(addedScore: number): void {
    this.score += addedScore;
  }
}
