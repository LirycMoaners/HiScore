import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Game } from '../../shared/game/game.model';
import { Score } from '../../shared/score/score.model';
import { Goal } from '../../shared/game-category/goal.enum';

@Component({
  selector: 'hs-win-dialog',
  templateUrl: 'win-dialog.component.html',
  styleUrls: ['win-dialog.component.scss']
})

export class WinDialogComponent implements OnInit {
  public isLeaving = true;
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
