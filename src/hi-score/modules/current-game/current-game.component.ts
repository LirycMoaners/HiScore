import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { WinDialogComponent } from './win-dialog/win-dialog.component';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../shared/models/game.model';
import { GameService } from '../../core/services/game.service';
import { OptionMenuService } from '../../core/header/option-menu/option-menu.service';
import { Score } from '../../shared/models/score.model';
import { Goal } from '../../shared/models/goal.enum';
import { EndingType } from '../../shared/models/ending-type.enum';
import { HeaderService } from '../../core/header/header.service';

/**
 * Component of the current game session
 *
 * @export
 * @class CurrentGameComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'hs-current-game',
  templateUrl: 'current-game.component.html',
  styleUrls: ['current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnDestroy {
  /**
   * The current game
   *
   * @type {Game}
   * @memberof CurrentGameComponent
   */
  public game: Game;

  /**
   * The id of the first player to start the first round
   *
   * @type {string}
   * @memberof CurrentGameComponent
   */
  public firstPlayerId: string;

  /**
   * List of all the subscription in the component to unsuscribe on destroy
   *
   * @private
   * @type {Subscription[]}
   * @memberof CurrentGameComponent
   */
  private subscriptionList: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private optionMenuService: OptionMenuService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.gameService.getGameById(this.route.snapshot.params['id'])
      .subscribe((game: Game) => {
        this.game = game;
        this.headerService.title = game.gameCategory.name + ' (round ' + game.scoreList[0].roundScoreList.length + ')';
        this.gameService.currentGameId = game.id;
        if (this.game.isGameEnd) {
          this.openWinDialog();
        }
        if (this.game.scoreList[0].roundScoreList.length === 1 && this.game.isFirstPlayerRandom) {
          const index: number = Math.floor(Math.random() * this.game.scoreList.length);
          this.firstPlayerId = this.game.scoreList[index].playerId;
        }
      });
    this.headerService.isLeftSide = true;

    this.subscriptionList.push(
      this.optionMenuService.editLastRound$.subscribe(() => {
        if (this.game.scoreList[0].roundScoreList.length > 1) {
          for (const score of this.game.scoreList) {
            score.total -= score.roundScoreList.shift();
            this.refreshBestScore();
            this.gameService.updateGame(this.game).subscribe(() => {
              this.headerService.title = this.game.gameCategory.name + ' (round ' + this.game.scoreList[0].roundScoreList.length + ')';
            });
          }
        }
      })
    );

    this.subscriptionList.push(
      this.optionMenuService.endGame$.subscribe(() => {
        this.game.isGameEnd = true;
        this.openWinDialog();
      })
    );
  }

  ngOnDestroy(): void {
    this.headerService.isLeftSide = false;
    for (const subscription of this.subscriptionList) {
      subscription.unsubscribe();
    }
  }

  /**
   * Validate a round by :
   * - Refreshing best scores
   * - Adding a new round
   * - Saving the game
   * - Changing the main bar title
   *
   * @memberof CurrentGameComponent
   */
  public validateRound() {
    this.refreshBestScore();

    this.game.isGameEnd = this.isGameEnd();
    if (this.game.isGameEnd) {
      this.openWinDialog();
    } else {
      for (const score of this.game.scoreList) {
        score.roundScoreList.unshift(0);
      }
    }
    this.gameService.updateGame(this.game).subscribe(() => {
      this.headerService.title = this.game.gameCategory.name + ' (round ' + this.game.scoreList[0].roundScoreList.length + ')';
    });
  }

  /**
   * Add 1 to the round score of a player
   *
   * @param {Score} score
   * @memberof CurrentGameComponent
   */
  public onClickPlus(score: Score) {
    score.roundScoreList[0] += 1;
    this.calculateTotal(score);
  }

  /**
   * Remove 1 to the round score of a player
   *
   * @param {Score} score
   * @memberof CurrentGameComponent
   */
  public onClickMinus(score: Score) {
    score.roundScoreList[0] -= 1;
    this.calculateTotal(score);
  }

  /**
   * Open the score dialog and update the round score and the total of a player
   *
   * @param {Score} score
   * @param {number} roundIndex
   * @memberof CurrentGameComponent
   */
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

  /**
   * Update round score and change the input value to 0 if there is no value
   *
   * @param {Score} score
   * @param {HTMLInputElement} inputScore
   * @memberof CurrentGameComponent
   */
  public onChangeRoundScore(score: Score, inputScore: HTMLInputElement) {
    inputScore.value = inputScore.value ? inputScore.value : '0';
    score.roundScoreList[0] = Number(inputScore.value);
    this.calculateTotal(score);
  }

  /**
   * Calculate the total score for a player
   *
   * @private
   * @param {Score} score
   * @memberof CurrentGameComponent
   */
  private calculateTotal(score: Score) {
    score.total = score.roundScoreList.reduce((total: number, roundScore: number) => total + Number(roundScore));

    if (this.game.scoreList[0].roundScoreList.length > 1) {
      this.refreshBestScore();
    }

    this.gameService.updateGame(this.game).subscribe();
  }

  /**
   * Refresh best scores
   *
   * @private
   * @memberof CurrentGameComponent
   */
  private refreshBestScore() {
    let bestScore: number;
    if (this.game.gameCategory.goal === Goal.highestScore) {
      bestScore = Math.max(...this.game.scoreList.map((sc: Score) => sc.total));
    } else {
      bestScore = Math.min(...this.game.scoreList.map((sc: Score) => sc.total));
    }
    this.game.firstPlayerList = this.game.scoreList.filter((sc: Score) => sc.total === bestScore).map((sc: Score) => sc.playerId);
  }

  /**
   * Check if it's the end of the game adter validating a round
   *
   * @private
   * @returns {boolean}
   * @memberof CurrentGameComponent
   */
  private isGameEnd(): boolean {
    if (this.game.gameCategory.endingType === EndingType.point) {
      return !!this.game.scoreList.find((score: Score) => score.total >= this.game.gameCategory.endingNumber);
    } else {
      return this.game.scoreList[0].roundScoreList.length === this.game.gameCategory.endingNumber;
    }
  }

  /**
   * Open the win dialog to show the ranking of each player and their score.
   * Redirect to the game list if the user chose it or add a new round to continue.
   *
   * @private
   * @memberof CurrentGameComponent
   */
  private openWinDialog() {
    const dialogRef = this.dialog.open(WinDialogComponent, {
      width: '420px',
      data: this.game
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gameService.updateGame(this.game).subscribe(() => this.router.navigate(['']));
      } else {
        this.game.isGameEnd = false;
        for (const score of this.game.scoreList) {
          score.roundScoreList.unshift(0);
        }
        this.gameService.updateGame(this.game).subscribe();
      }
    });
  }
}
