import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Subscription, combineLatest } from 'rxjs';
import { flatMap, map, first, tap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

import { Game } from '../../shared/models/game.model';
import { Player } from '../../shared/models/player.model';
import { GameCategory } from '../../shared/models/game-category.model';
import { EndingType } from '../../shared/models/ending-type.enum';
import { Goal } from '../../shared/models/goal.enum';
import { NonUserPlayerService } from '../../core/http-services/non-user-player.service';
import { GameCategoryService } from '../../core/http-services/game-category.service';
import { GameService } from '../../core/http-services/game.service';
import { Score } from '../../shared/models/score.model';
import { HeaderService } from '../../core/header/header.service';
import { NewPlayerScoreDialogComponent } from './new-player-score-dialog/new-player-score-dialog.component';
import { PlayerService } from '../../core/http-services/player.service';
import { UserService } from '../../core/http-services/user.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
export class GameEditionComponent implements OnInit, OnDestroy {
  /**
   * The current game in edition
   */
  public game!: Game;

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
   * Name of the new player that need to be added
   */
  public newPlayerName = '';

  /**
   * The filterd game category by input text
   */
  public filteredGameCategoryList: GameCategory[] = [];

  /**
   * The complete game category list
   */
  public gameCategoryList: GameCategory[] = [];

  /**
   * Input text of the game category
   */
  public gameCategoryName = '';

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
  private newPlayerScore = 0;

  /**
   * The subscription of the current game during update
   */
  private currentUpdatedGameSubscription: Subscription | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly headerService: HeaderService,
    private readonly nonUserPlayerService: NonUserPlayerService,
    private readonly playerService: PlayerService,
    private readonly gameCategoryService: GameCategoryService,
    private readonly gameService: GameService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    const gameId: string = this.route.snapshot.params.id;
    const isCopy: boolean = this.route.snapshot.queryParams.copy;

    let game$: Observable<Game | undefined>;
    const players$: Observable<[Player[], Player[]]> = combineLatest([
      this.nonUserPlayerService.elementListSubject,
      this.playerService.elementListSubject
    ]).pipe(
      first(),
      tap(([nonUserPlayerList, playerList]: [Player[], Player[]]) =>
        this.playerList = [...nonUserPlayerList, ...playerList]
          .sort((p1, p2) => (!!p1.displayName ? p1.displayName : '').localeCompare(!!p2.displayName ? p2.displayName : ''))
      )
    );

    this.gameCategoryService.elementListSubject
      .pipe(first())
      .subscribe((gameCategoryList: GameCategory[]) => {
        this.gameCategoryList = [...gameCategoryList];
        this.filteredGameCategoryList = [...this.gameCategoryList];
      });

    if (gameId) {
      if (!isCopy) {
        this.headerService.title = 'Game Edition';
        this.isCreationMode = false;
        game$ = this.gameService.getElementById(gameId);
      } else {
        this.headerService.title = 'New Game';
        game$ = this.gameService.getElementById(gameId).pipe(
          first(),
          map((game: Game | undefined) => {
            if (!!game) {
              const newGame = { ...game };
              newGame.id = UUID.UUID();
              newGame.isGameEnd = false;
              newGame.firstPlayerList = [];
              return newGame;
            }
            return new Game();
          })
        );
      }

      this.currentUpdatedGameSubscription = game$.subscribe((game: Game | undefined) => {
        this.game = !!game ? game : new Game();
        this.gameCategoryName = this.game.gameCategory.name;
        this.gamePlayerList = this.game.scoreList.map(score => score.player);
      });

      players$.subscribe(() => this.filterPlayerList());
    } else {
      this.headerService.title = 'New Game';
      this.game = new Game();
      this.game.id = UUID.UUID();
      this.game.isGameEnd = false;
      this.game.isFirstPlayerRandom = false;
      this.game.firstPlayerList = [];
      this.game.gameCategory = new GameCategory();

      players$.subscribe();
    }
  }

  ngOnDestroy(): void {
    if (this.currentUpdatedGameSubscription && !this.currentUpdatedGameSubscription.closed) {
      this.currentUpdatedGameSubscription.unsubscribe();
    }
  }

  /**
   * Move the player in list when dropped
   */
  public drop(event: CdkDragDrop<Player[]>): void {
    moveItemInArray(this.gamePlayerList, event.previousIndex, event.currentIndex);
  }

  /**
   * Create a new player or copy a player to be added when new player output blur or enter key press
   */
  public onNewPlayerOut(event: FocusEvent | KeyboardEvent, input: HTMLInputElement): void {
    let player: Player | undefined = this.gamePlayerList.find((pl: Player) => input.value === pl.displayName);
    let shouldAddPlayer = false;

    if (input.value && !player) {
      if (
        event instanceof FocusEvent
        && (
          !event.relatedTarget
          || (
            (event.relatedTarget as HTMLInputElement).tagName !== 'MAT-OPTION'
            && !((event.relatedTarget as HTMLInputElement).className as string).includes('delete')
          )
        )
      ) {
        shouldAddPlayer = true;
      } else if (event instanceof KeyboardEvent && event.key === 'Enter') {
        shouldAddPlayer = true;
      }
    }

    if (shouldAddPlayer) {
      if (!player) {
        player = new Player();
        player.displayName = input.value;
      }

      this.addPlayer(player, input);
    }
  }

  /**
   * Add a player to the game player list
   */
  public addPlayer(newPlayer: Player, input: HTMLInputElement): void {
    const player = Object.assign({}, newPlayer);
    input.value = '';
    this.gamePlayerList.push(player);

    if (!!this.game && !this.isCreationMode
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
  public changePlayer(oldPlayer: Player, event: Event | MatAutocompleteSelectedEvent, playerInput: HTMLInputElement): void {
    if (event) {
      if (event instanceof Event) {
        const playerDisplayName = (event.target as HTMLInputElement).value;
        if (!this.gamePlayerList.find((pl: Player) => playerDisplayName === pl.displayName)) {
          const newPlayer: Player | undefined = this.playerList.find((pl: Player) => pl.displayName === playerDisplayName);
          if (!!newPlayer) {
            oldPlayer.id = newPlayer.id;
            oldPlayer.displayName = newPlayer.displayName;
          } else {
            oldPlayer.id = UUID.UUID();
            oldPlayer.displayName = playerDisplayName;
          }
        }
      } else {
        const player = event.option.value;
        if (!this.gamePlayerList.find((pl: Player) => player.displayName === pl.displayName)) {
          oldPlayer.id = player.id;
          oldPlayer.displayName = player.displayName;
        }
      }

      playerInput.value = !!oldPlayer.displayName ? oldPlayer.displayName : '';

      if (!!this.game && !this.isCreationMode
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
  public removePlayer(player: Player): void {
    this.gamePlayerList.splice(this.gamePlayerList.indexOf(player), 1);
    this.filterPlayerList();
  }

  /**
   * Delete the non user player in parameter
   */
  public deleteNonUserPlayer(event: MouseEvent, player: Player): void {
    event.stopPropagation();
    this.nonUserPlayerService.deleteElement(player).subscribe(() => {
      this.playerList.splice(this.playerList.findIndex(pl => pl.id === player.id), 1);
      this.filteredPlayerList.splice(this.filteredPlayerList.findIndex(pl => pl.id === player.id), 1);
    });
  }

  /**
   * Filter the player list with the input text and the already added players
   */
  public filterPlayerList(name?: string): void {
    const filteredValue = name && typeof name === 'string' ? name.toLowerCase() : '';
    this.filteredPlayerList = this.playerList.filter(
      (player: Player) => !this.gamePlayerList.find((pl: Player) => pl.displayName === player.displayName)
        && player.displayName?.toLowerCase().includes(filteredValue)
    );
  }

  /**
   * Filter the game category list with the input text
   */
  public filterGameCategoryList(filteredValue: string): void {
    if (filteredValue && filteredValue.length > 0) {
      this.filteredGameCategoryList = this.gameCategoryList.filter(
        (gameCategory: GameCategory) => gameCategory.name.toLowerCase().includes(filteredValue.toLowerCase())
      );
    } else {
      this.filteredGameCategoryList = [...this.gameCategoryList];
    }
  }

  /**
   * Choose or create the game category when out of the field
   */
  public onGameCategoryOut(event: FocusEvent | KeyboardEvent, input: HTMLInputElement): void {
    let shouldChooseGameCategory = false;

    if (input.value) {
      if (event instanceof FocusEvent && (!event.relatedTarget || (event.relatedTarget as HTMLInputElement).tagName !== 'MAT-OPTION')) {
        shouldChooseGameCategory = true;
        this.filterGameCategoryList(input.value);
      } else if (event instanceof KeyboardEvent && event.key === 'Enter') {
        shouldChooseGameCategory = true;
      }
    }

    if (shouldChooseGameCategory) {
      let gameCategory: GameCategory | undefined = this.gameCategoryList.find((gc: GameCategory) => input.value === gc.name);
      if (!gameCategory) {
        gameCategory = new GameCategory();
        gameCategory.name = input.value;
      }

      this.onSelectGameCategory(gameCategory, input);
    } else {
      if (!!this.game) {
        this.game.gameCategory = new GameCategory();
      }
    }
  }

  /**
   * Assign a game category to the current game
   */
  public onSelectGameCategory(gameCategory: GameCategory, gameCategoryInput: HTMLInputElement): void {
    if (!!this.game) {
      gameCategoryInput.value = gameCategory.name;
      this.gameCategoryName = gameCategory.name;
      this.game.gameCategory = {...gameCategory};
    }
  }

  /**
   * Delete the game category in parameter
   */
  public deleteGameCategory(gameCategory: GameCategory): void {
    this.gameCategoryService.deleteElement(gameCategory).subscribe(() => {
      this.gameCategoryList.splice(this.gameCategoryList.findIndex(gc => gc.id === gameCategory.id), 1);
      this.filteredGameCategoryList.splice(this.filteredGameCategoryList.findIndex(gc => gc.id === gameCategory.id), 1);
    });
  }

  /**
   * Start a new game or resume the current game with the selected players and the selected game category
   */
  public startGame(): void {
    if (!!this.game && this.gamePlayerList.length && this.game.gameCategory.id) {
      this.game.date = this.isCreationMode ? new Date() : this.game.date;
      this.game.scoreList = this.isCreationMode ? [] : this.game.scoreList;
      this.game.userIds = this.gamePlayerList.filter(player => player.isUser).map(player => player.id);
      const currentUserUid = this.userService.user?.uid;
      if (!!currentUserUid) {
        this.game.adminIds = [currentUserUid];
        const userIdIndex = this.game.userIds.findIndex(uid => uid === currentUserUid);
        if (userIdIndex === -1) {
          this.game.userIds.push(currentUserUid);
        }
      }

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
          const playerScore: Score | undefined = this.game.scoreList.find((score: Score) => score.player.id === player.id);
          if (!!playerScore) {
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

      const gameCategory = this.gameCategoryList.find(gc => !!this.game ? gc.id === this.game.gameCategory.id : false);

      combineLatest([
        (newPlayerList.length ? this.nonUserPlayerService.createElementList(newPlayerList) : of(null)),
        (!gameCategory ? this.gameCategoryService.createElement(this.game.gameCategory) : of(null)),
      ]).pipe(
        flatMap(() =>
          !!this.game ? (
            this.isCreationMode ? this.gameService.createElement(this.game) : this.gameService.updateElement(this.game)
          ) : of(null)
        )
      ).subscribe(() => !!this.game ? this.router.navigate(['/current-game/' + this.game.id]) : undefined);
    }
  }

  /**
   * Refresh best scores after modifying player list
   */
  private refreshBestScore(): void {
    if (!!this.game) {
      let bestScore: number;
      if (this.game.gameCategory.goal === Goal.highestScore) {
        bestScore = Math.max(...this.game.scoreList.map((sc: Score) => sc.total));
      } else {
        bestScore = Math.min(...this.game.scoreList.map((sc: Score) => sc.total));
      }
      this.game.firstPlayerList = this.game.scoreList.filter((sc: Score) => sc.total === bestScore).map((sc: Score) => sc.player.id);
    }
  }

  /**
   * Open the dialog for chosing if the new players scores need to be zero or the average of the others scores
   */
  private openNewPlayerScoreDialog(): void {
    const dialogRef = this.dialog.open(NewPlayerScoreDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && !!this.game) {
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
