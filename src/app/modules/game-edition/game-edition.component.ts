import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, map, first, tap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

import { Game } from '../../shared/models/game.model';
import { Player } from '../../shared/models/player.model';
import { GameCategory } from '../../shared/models/game-category.model';
import { EndingType } from '../../shared/models/ending-type.enum';
import { Goal } from '../../shared/models/goal.enum';
import { PlayerService } from '../../core/http-services/player.service';
import { GameCategoryService } from '../../core/http-services/game-category.service';
import { GameService } from '../../core/http-services/game.service';
import { Score } from '../../shared/models/score.model';
import { HeaderService } from '../../core/header/header.service';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { NewPlayerScoreDialogComponent } from './new-player-score-dialog/new-player-score-dialog.component';

/**
 * Component for game creation and edition
 *
 * @export
 */
@Component({
  selector: 'app-game-edition',
  templateUrl: 'game-edition.component.html',
  styleUrls: ['game-edition.component.scss']
})
export class GameEditionComponent implements OnInit {
  /**
   * The current game in edition
   */
  public game: Game;

  /**
   * The complete player list without those who are already added
   * and those who do not correspond to the input text
   */
  public filteredPlayerList: Player[] = [];

  /**
   * The complete player list
   */
  public playerList: Player[] = [];

  /**
   * The player list of the current game
   */
  public gamePlayerList: Player[] = [];

  /**
   * The complete game category list
   */
  public gameCategoryList: GameCategory[] = [];

  /**
   * The game category that has been chosen for the current game
   */
  public chosenGameCategory: GameCategory;

  /**
   * Name of the new player that need to be added
   */
  public newPlayerName = '';

  /**
   * Specify if the component is used for game creation or game edition
   */
  public isCreationMode = true;

  /**
   * Ending type enum for HTML
   */
  public EndingType: typeof EndingType = EndingType;

  /**
   * Goal enum for HTML
   */
  public Goal: typeof Goal = Goal;

  /**
   * The score of each player added on game edition
   */
  private newPlayerScore: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly headerService: HeaderService,
    private readonly playerService: PlayerService,
    private readonly gameCategoryService: GameCategoryService,
    private readonly gameService: GameService
  ) { }

  ngOnInit() {
    const gameId: string = this.route.snapshot.params.id;
    const isCopy: boolean = this.route.snapshot.queryParams.copy;

    let game$: Observable<Game>;
    const players$: Observable<Player[]> = this.playerService.elementListSubject.pipe(
      first(),
      tap((playerList: Player[]) => this.playerList = playerList)
    );
    const gameCategories$: Observable<GameCategory[]> = this.gameCategoryService.elementListSubject.pipe(
      first(),
      tap((gameCategoryList: GameCategory[]) => this.gameCategoryList = gameCategoryList)
    );

    if (gameId) {
      if (!isCopy) {
        this.headerService.title = 'Game Edition';
        this.isCreationMode = false;
        game$ = this.gameService.getElementById(gameId);
      } else {
        this.headerService.title = 'New Game';
        game$ = this.gameService.getElementById(gameId).pipe(
          map((game: Game) => {
            const newGame = { ...game };
            newGame.id = UUID.UUID();
            newGame.isGameEnd = false;
            newGame.firstPlayerList = [];
            return newGame;
          })
        );
      }

      game$.pipe(first())
        .subscribe((game: Game) => {
          this.game = game;
          this.gamePlayerList = this.game.scoreList.map(score => score.player);
          this.chosenGameCategory = this.game.gameCategory;
        });

      players$.subscribe(() => this.filterPlayerList());

      gameCategories$.subscribe();
    } else {
      this.headerService.title = 'New Game';
      this.game = new Game();
      this.game.id = UUID.UUID();
      this.game.isGameEnd = false;
      this.game.isFirstPlayerRandom = false;
      this.game.firstPlayerList = [];
      this.chosenGameCategory = new GameCategory();

      players$.subscribe();

      gameCategories$.subscribe(() => {
        this.chosenGameCategory = this.gameCategoryList[0];
        this.onSelectGameCategory(this.gameCategoryList[0]);
      });
    }
  }

  /**
   * Move the player in list when dropped
   */
  public drop(event: CdkDragDrop<Player[]>) {
    moveItemInArray(this.gamePlayerList, event.previousIndex, event.currentIndex);
  }

  /**
   * Create a new player or copy a player to be added when new player output blur or enter key press
   */
  public onNewPlayerOut(event: FocusEvent | KeyboardEvent, input: HTMLInputElement) {
    let player: Player;
    let shouldAddPlayer = false;

    if (input.value && !this.gamePlayerList.find((pl: Player) => input.value === pl.name)) {
      if (event instanceof FocusEvent && (!event.relatedTarget || (event.relatedTarget as any).tagName !== 'MAT-OPTION')) {
        shouldAddPlayer = true;
      } else if (event instanceof KeyboardEvent && event.key === 'Enter') {
        shouldAddPlayer = true;
      }
    }

    if (shouldAddPlayer) {
      player = this.playerList.find((pl: Player) => pl.name === input.value);

      if (!player) {
        player = new Player();
        player.id = UUID.UUID();
        player.name = input.value;
      }

      this.addPlayer(player, input);
    }
  }

  /**
   * Add a player to the game player list
   */
  public addPlayer(newPlayer: Player, input: HTMLInputElement) {
    const player = Object.assign({}, newPlayer);
    input.value = '';
    this.gamePlayerList.push(player);

    if (!this.isCreationMode
      && !this.game.scoreList.find((score: Score) => score.player.id === player.id)
      && (this.newPlayerScore === null || this.newPlayerScore === undefined)
    ) {
      this.openNewPlayerScoreDialog();
    }

    this.newPlayerName = '';
    this.filterPlayerList();
  }

  /**
   * Change an added player by another player or a new player
   */
  public changePlayer(oldPlayer: Player, player: Player | string, playerInput: HTMLInputElement) {
    if (player) {
      if (typeof player === 'string') {
        if (!this.gamePlayerList.find((pl: Player) => player === pl.name)) {
          const newPlayer: Player = this.playerList.find((pl: Player) => pl.name === player);
          if (newPlayer) {
            oldPlayer.id = newPlayer.id;
            oldPlayer.name = newPlayer.name;
          } else {
            oldPlayer.id = UUID.UUID();
            oldPlayer.name = player;
          }
        }
      } else {
        if (!this.gamePlayerList.find((pl: Player) => player.name === pl.name)) {
          oldPlayer.id = player.id;
          oldPlayer.name = player.name;
        }
      }

      playerInput.value = oldPlayer.name;

      if (!this.isCreationMode
        && !this.game.scoreList.find((score: Score) => score.player.id === oldPlayer.id)
        && (this.newPlayerScore === null || this.newPlayerScore === undefined)
      ) {
        this.openNewPlayerScoreDialog();
      }
    } else {
      this.gamePlayerList.splice(this.gamePlayerList.indexOf(oldPlayer), 1);
    }

    this.filterPlayerList();
  }

  /**
   * Remove a player from the game player list
   */
  public removePlayer(player: Player) {
    this.gamePlayerList.splice(this.gamePlayerList.indexOf(player), 1);
    this.filterPlayerList();
  }

  /**
   * Filter the player list with the input text and the already added players
   */
  public filterPlayerList(name?: string) {
    const filteredValue = name && typeof name === 'string' ? name.toLowerCase() : '';
    this.filteredPlayerList = this.playerList.filter(
      (player: Player) => !this.gamePlayerList.find((pl: Player) => pl.name === player.name)
        && player.name.toLowerCase().includes(filteredValue)
      );
  }

  /**
   * Assign a game category to the current game
   */
  public onSelectGameCategory(gameCategory: GameCategory) {
    this.game.gameCategory = Object.assign({}, gameCategory);
  }

  /**
   * Open the dialog to add new category and select this new category at dialog close
   */
  public openCategoryDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chosenGameCategory = result;
        this.onSelectGameCategory(result);
      }
    });
  }

  /**
   * Start a new game or resume the current game with the selected players and the selected game category
   */
  public startGame() {
    if (this.gamePlayerList.length && this.chosenGameCategory.id) {
      this.game.date = this.isCreationMode ? new Date() : this.game.date;
      this.game.scoreList = this.isCreationMode ? [] : this.game.scoreList;

      const newPlayerList: Player[] = [];
      const newScoreList: Score[] = [];
      const voidRoundScoreList: number[] = [];

      for (const player of this.gamePlayerList) {
        newScoreList.push({
          player,
          roundScoreList: [0],
          total: 0
        });

        if (!this.isCreationMode) {
          const playerScore: Score = this.game.scoreList.find((score: Score) => score.player.id === player.id);
          if (playerScore) {
            newScoreList[newScoreList.length - 1].roundScoreList = playerScore.roundScoreList;
            newScoreList[newScoreList.length - 1].total = playerScore.total;
          } else {
            if (!voidRoundScoreList.length) {
              for (let i = 0; i < this.game.scoreList[0].roundScoreList.length; i++) {
                if (i === 1 && !(this.newPlayerScore === null || this.newPlayerScore === undefined)) {
                  voidRoundScoreList.push(this.newPlayerScore);
                } else {
                  voidRoundScoreList.push(0);
                }
              }
            }
            newScoreList[newScoreList.length - 1].roundScoreList = Object.assign([], voidRoundScoreList);
            newScoreList[newScoreList.length - 1].total = this.newPlayerScore;
          }
        }

        if (!this.playerList.find((pl: Player) => pl.id === player.id)) {
          newPlayerList.push(player);
        }
      }

      this.game.scoreList = newScoreList;

      if (!this.isCreationMode && this.game.scoreList[0].roundScoreList.length > 1) {
        this.refreshBestScore();
      }

      (newPlayerList.length ? this.playerService.createElementList(newPlayerList) : of(null))
        .pipe(
          flatMap(() => this.isCreationMode ? this.gameService.createElement(this.game) : this.gameService.updateElement(this.game))
        )
        .subscribe(() => this.router.navigate(['/current-game/' + this.game.id]));
    }
  }

  /**
   * Refresh best scores after modifying player list
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
   * Open the dialog for chosing if the new players scores need to be zero or the average of the others scores
   */
  private openNewPlayerScoreDialog() {
    const dialogRef = this.dialog.open(NewPlayerScoreDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newPlayerScore = Number((
            this.game.scoreList
              .map((score: Score) => score.total)
              .reduce((scoreTotal: number, score: number) => scoreTotal + score)
            / this.game.scoreList.length
          ).toFixed(0));
      } else {
        this.newPlayerScore = 0;
      }
    });
  }
}
