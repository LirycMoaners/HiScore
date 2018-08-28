import { Component, OnInit, HostListener } from '@angular/core';
import { GameService } from '../shared/game/game.service';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../shared/game/game.model';
import { Score } from '../shared/score/score.model';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { MatDialog } from '@angular/material';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';

@Component({
  selector: 'ks-current-game',
  templateUrl: 'current-game.component.html',
  styleUrls: ['current-game.component.scss']
})

export class CurrentGameComponent implements OnInit {
  public game: Game;
  public modifiedScore: Score;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private mainBarService: MainBarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.gameService.getGameById(this.route.snapshot.params['id'])
      .subscribe((game: Game) => {
        this.game = game;
        this.mainBarService.setTitle(game.gameCategory.name + ' (round ' + game.scoreList[0].roundScoreList.length + ')');
      });
    this.mainBarService.setIsLeftSide(true);
  }

  public validateRound() {
    for (const score of this.game.scoreList) {
      score.roundScoreList.push(0);
    }
    this.refreshBestScore();
    this.gameService.saveGame(this.game);
  }

  public onClickPlus(score: Score) {
    score.roundScoreList[score.roundScoreList.length - 1] += 1;
    this.calculateTotal(score);
  }

  public onClickMinus(score: Score) {
    score.roundScoreList[score.roundScoreList.length - 1] -= 1;
    this.calculateTotal(score);
  }

  public onChangeRoundScore(score: Score, inputScore: HTMLInputElement) {
    inputScore.value = inputScore.value ? inputScore.value : '0';
    score.roundScoreList[score.roundScoreList.length - 1] = Number(inputScore.value);
    this.calculateTotal(score);
  }

  public openDialog(score: Score, roundIndex: number) {
    const dialogRef = this.dialog.open(ScoreDialogComponent, {
      width: '420px',
      data: score.roundScoreList[roundIndex]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      score.roundScoreList[roundIndex] = result || score.roundScoreList[roundIndex];
      this.calculateTotal(score);
    });
  }

  private calculateTotal(score: Score) {
    score.total = score.roundScoreList.reduce((total: number, roundScore: number) => total + Number(roundScore));
  }
}
