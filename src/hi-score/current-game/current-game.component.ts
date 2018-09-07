import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../shared/game/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../shared/game/game.model';
import { Score } from '../shared/score/score.model';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { MatDialog } from '@angular/material';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { Goal } from '../shared/game-category/goal.enum';
import { EndingType } from '../shared/game-category/ending-type.enum';
import { WinDialogComponent } from './win-dialog/win-dialog.component';
import { OptionMenuService } from '../shared/option-menu/option-menu.service';

@Component({
  selector: 'hs-current-game',
  templateUrl: 'current-game.component.html',
  styleUrls: ['current-game.component.scss']
})

export class CurrentGameComponent implements OnInit, OnDestroy {
  public game: Game;
  public modifiedScore: Score;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private mainBarService: MainBarService,
    private optionMenuService: OptionMenuService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.gameService.getGameById(this.route.snapshot.params['id'])
      .subscribe((game: Game) => {
        this.game = game;
        this.mainBarService.setTitle(game.gameCategory.name + ' (round ' + game.scoreList[0].roundScoreList.length + ')');
        this.gameService.setCurrentGameId(game.id);
        if (this.isGameEnd() && !this.game.isGameContinuing) {
          this.openWinDialog();
        }
      });
    this.mainBarService.setIsLeftSide(true);
    this.mainBarService.setIsOptionMenuVisible(true);

    this.optionMenuService.getEditLastRound().subscribe(() => {
      if (this.game.scoreList[0].roundScoreList.length > 1) {
        for (const score of this.game.scoreList) {
          score.total -= score.roundScoreList.shift();
          this.refreshBestScore();
          this.gameService.updateGame(this.game).subscribe(() => {
            this.mainBarService.setTitle(this.game.gameCategory.name + ' (round ' + this.game.scoreList[0].roundScoreList.length + ')');
          });
        }
      }
    });

    this.optionMenuService.getNewGame().subscribe(() => {
      this.router.navigate(['/game-creation'], {queryParams: {copy: true}});
    });
  }

  ngOnDestroy(): void {
    this.mainBarService.setIsLeftSide(false);
    this.mainBarService.setIsOptionMenuVisible(false);
  }

  public validateRound() {
    this.refreshBestScore();

    if (this.isGameEnd() && !this.game.isGameContinuing) {
      this.openWinDialog();
    } else {
      for (const score of this.game.scoreList) {
        score.roundScoreList.unshift(0);
      }
    }
    this.gameService.updateGame(this.game).subscribe(() => {
      this.mainBarService.setTitle(this.game.gameCategory.name + ' (round ' + this.game.scoreList[0].roundScoreList.length + ')');
    });
  }

  public onClickPlus(score: Score) {
    score.roundScoreList[0] += 1;
    this.calculateTotal(score);
  }

  public onClickMinus(score: Score) {
    score.roundScoreList[0] -= 1;
    this.calculateTotal(score);
  }

  public onChangeRoundScore(score: Score, inputScore: HTMLInputElement) {
    inputScore.value = inputScore.value ? inputScore.value : '0';
    score.roundScoreList[0] = Number(inputScore.value);
    this.calculateTotal(score);
  }

  public openScoreDialog(score: Score, roundIndex: number) {
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

    if (this.game.scoreList[0].roundScoreList.length > 1) {
      this.refreshBestScore();
    }
  }

  private refreshBestScore() {
    let bestScore: number;
    if (this.game.gameCategory.goal === Goal.highestScore) {
      bestScore = Math.max(...this.game.scoreList.map((sc: Score) => sc.total));
    } else {
      bestScore = Math.min(...this.game.scoreList.map((sc: Score) => sc.total));
    }
    this.game.firstPlayerList = this.game.scoreList.filter((sc: Score) => sc.total === bestScore).map((sc: Score) => sc.playerId);
  }

  private isGameEnd(): boolean {
    if (this.game.gameCategory.endingType === EndingType.point) {
      return !!this.game.scoreList.find((score: Score) => score.total >= this.game.gameCategory.endingNumber);
    } else {
      return this.game.scoreList[0].roundScoreList.length === this.game.gameCategory.endingNumber;
    }
  }

  private openWinDialog() {
    const dialogRef = this.dialog.open(WinDialogComponent, {
      width: '420px',
      data: this.game
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gameService.updateGame(this.game);
        this.router.navigate(['']);
      } else {
        this.game.isGameContinuing = true;
        for (const score of this.game.scoreList) {
          score.roundScoreList.unshift(0);
        }
      }
    });
  }
}
