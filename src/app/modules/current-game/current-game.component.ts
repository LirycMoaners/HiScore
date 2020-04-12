import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, ReplaySubject, of } from 'rxjs';
import { flatMap, first } from 'rxjs/operators';

import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { WinDialogComponent } from './win-dialog/win-dialog.component';
import { Game } from '../../shared/models/game.model';
import { GameService } from '../../core/http-services/game.service';
import { OptionMenuService } from '../../core/header/option-menu/option-menu.service';
import { Score } from '../../shared/models/score.model';
import { Goal } from '../../shared/models/goal.enum';
import { EndingType } from '../../shared/models/ending-type.enum';
import { HeaderService } from '../../core/header/header.service';
import { UserService } from 'src/app/core/http-services/user.service';
import { User } from 'firebase';

/**
 * Component of the current game session
 *
 * @export
 */
@Component({
  selector: 'app-current-game',
  templateUrl: 'current-game.component.html',
  styleUrls: ['current-game.component.scss']
})
export class CurrentGameComponent implements OnInit, OnDestroy {
  /**
   * The current game
   */
  public game: Game;

  /**
   * The id of the first player to start the first round
   */
  public firstPlayerId: string;

  /**
   * Indicates if the current user can modify the game
   */
  public canEditGame = false;

  /**
   * Indicate if the current user is an admin of this game
   */
  public isUserAdmin = true;

  /**
   * List of all the subscription in the component to unsuscribe on destroy
   */
  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly gameService: GameService,
    private readonly headerService: HeaderService,
    private readonly optionMenuService: OptionMenuService,
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.subscriptionList.push(
      this.gameService.getElementById(this.route.snapshot.params.id).subscribe((game: Game) => {
        this.game = game;
        this.gameService.currentGame.next(game);
        this.canEditGame = this.getCanEditGame(game, this.userService.user);
        this.isUserAdmin = this.getIsUserAdmin(game, this.userService.user);
        if (this.game.isGameEnd) {
          this.headerService.title = game.gameCategory.name + ' (round ' + (game.scoreList[0].roundScoreList.length - 1) + ')';
          this.openWinDialog();
        } else {
          this.headerService.title = game.gameCategory.name + ' (round ' + game.scoreList[0].roundScoreList.length + ')';
        }
        if (this.game.scoreList[0].roundScoreList.length === 1 && this.game.isFirstPlayerRandom) {
          const index: number = Math.floor(Math.random() * this.game.scoreList.length);
          this.firstPlayerId = this.game.scoreList[index].player.id;
        }
      })
    );

    setTimeout(() => this.headerService.isLeftSide = true, 0);

    this.subscriptionList.push(
      this.optionMenuService.editLastRound$.subscribe(() => {
        if (this.game.scoreList[0].roundScoreList.length > 1) {
          for (const score of this.game.scoreList) {
            score.total -= score.roundScoreList.shift();
            this.refreshBestScore();
            this.gameService.updateElement(this.game).subscribe(() => {
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
    this.gameService.currentGame = new ReplaySubject(1);
  }

  /**
   * Validate a round by :
   * - Refreshing best scores
   * - Adding a new round
   * - Saving the game
   * - Changing the main bar title
   */
  public validateRound() {
    this.refreshBestScore();

    this.game.isGameEnd = this.isGameEnd();
    for (const score of this.game.scoreList) {
      score.roundScoreList.unshift(0);
    }
    if (this.game.isGameEnd) {
      this.openWinDialog();
    } else {
      this.gameService.updateElement(this.game).subscribe(() => {
        this.headerService.title = this.game.gameCategory.name + ' (round ' + this.game.scoreList[0].roundScoreList.length + ')';
      });
    }
  }

  /**
   * Add 1 to the round score of a player
   */
  public onClickPlus(score: Score) {
    score.roundScoreList[0] += 1;
    this.calculateTotal(score);
  }

  /**
   * Remove 1 to the round score of a player
   */
  public onClickMinus(score: Score) {
    score.roundScoreList[0] -= 1;
    this.calculateTotal(score);
  }

  /**
   * Open the score dialog and update the round score and the total of a player
   */
  public openScoreDialog(score: Score, roundIndex: number) {
    if (this.canEditGame) {
      const dialogRef = this.dialog.open(ScoreDialogComponent, {
        width: '420px',
        data: score.roundScoreList[roundIndex]
      });

      dialogRef.afterClosed().subscribe(result => {
        score.roundScoreList[roundIndex] = result || score.roundScoreList[roundIndex];
        this.calculateTotal(score);
      });
    }
  }

  /**
   * Update round score and change the input value to 0 if there is no value
   */
  public onChangeRoundScore(score: Score, inputScore: HTMLInputElement) {
    inputScore.value = inputScore.value ? inputScore.value : '0';
    score.roundScoreList[0] = Number(inputScore.value);
    this.calculateTotal(score);
  }

  /**
   * Check if the current user can edit the current game
   */
  public getCanEditGame(game: Game, user: User): boolean {
    if (game.isSynced) {
      if (!!user) {
        return this.game.adminIds.includes(this.userService.user.uid);
      }
      return !game.scoreList.map(score => score.player).some(player => player.isUser);
    }
    return true;
  }

  /**
   * Check if the current user is an admin of this game
   */
  public getIsUserAdmin(game: Game, user: User): boolean {
    if (game.isSynced && !!user) {
      return this.game.adminIds.includes(this.userService.user.uid);
    }
    return true;
  }

  /**
   * Calculate the total score for a player
   */
  private calculateTotal(score: Score) {
    score.total = score.roundScoreList.reduce((total: number, roundScore: number) => total + Number(roundScore));

    if (this.game.scoreList[0].roundScoreList.length > 1) {
      this.refreshBestScore();
    }

    this.gameService.updateElement(this.game).subscribe();
  }

  /**
   * Refresh best scores
   */
  private refreshBestScore() {
    let bestScore: number;
    if (this.game.gameCategory.goal === Goal.highestScore) {
      bestScore = Math.max(...this.game.scoreList.map((sc: Score) => sc.total));
    } else {
      bestScore = Math.min(...this.game.scoreList.map((sc: Score) => sc.total));
    }
    this.game.firstPlayerList = this.game.scoreList.filter((sc: Score) => sc.total === bestScore).map((sc: Score) => sc.player.id);
  }

  /**
   * Check if it's the end of the game adter validating a round
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
   */
  private openWinDialog() {
    const dialogRef = this.dialog.open(WinDialogComponent, {
      width: '420px',
      data: {game : this.game, canEditGame: this.canEditGame},
      disableClose: !this.canEditGame
    });

    dialogRef.afterClosed().pipe(
      flatMap(result => {
        if (!result) {
          this.game.isGameEnd = false;
        } else {
          for (const subscription of this.subscriptionList) {
            subscription.unsubscribe();
          }
        }
        return this.canEditGame ? this.gameService.updateElement(this.game) : of(null);
      })
    ).subscribe(_ => {
      if (this.game.isGameEnd) {
        this.router.navigate(['']);
      } else {
        this.headerService.title = this.game.gameCategory.name + ' (round ' + this.game.scoreList[0].roundScoreList.length + ')';
      }
    });
  }
}
