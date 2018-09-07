import { Component, OnInit, HostListener } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { Player } from '../shared/player/player.model';
import { PlayerService } from '../shared/player/player.service';
import { GameCategory } from '../shared/game-category/game-category.model';
import { GameCategoryService } from '../shared/game-category/game-category.service';
import { Game } from '../shared/game/game.model';
import { UUID } from 'angular2-uuid';
import { GameService } from '../shared/game/game.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, of, combineLatest } from 'rxjs';
import { flatMap, first, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EndingType } from '../shared/game-category/ending-type.enum';
import { Goal } from '../shared/game-category/goal.enum';
import { Score } from '../shared/score/score.model';
import { isNullOrUndefined } from 'util';
import { NewPlayerScoreDialogComponent } from './new-player-score-dialog/new-player-score-dialog.component';

@Component({
  selector: 'hs-game-edition',
  templateUrl: 'game-edition.component.html',
  styleUrls: ['game-edition.component.scss']
})

export class GameEditionComponent implements OnInit {
  public game: Game;
  public filteredPlayerList: Player[] = [];
  public playerList: Player[] = [];
  public gamePlayerList: Player[] = [];
  public gameCategoryList: GameCategory[] = [];
  public chosenGameCategory: GameCategory;
  public newPlayerName = '';
  public EndingType: typeof EndingType = EndingType;
  public Goal: typeof Goal = Goal;
  public isCreationMode = true;
  private newPlayerScore: number;

  constructor(
    private mainBarService: MainBarService,
    private playerService: PlayerService,
    private gameCategoryService: GameCategoryService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const gameId: string = this.route.snapshot.params['id'];
    const isCopy: boolean = this.route.snapshot.queryParams['copy'];
    let game$: Observable<any>;

    if (gameId || isCopy) {
      if (gameId) {
        this.mainBarService.setTitle('Game Edition');
        this.isCreationMode = false;
        game$ = this.gameService.getGameById(gameId);
      } else {
        this.mainBarService.setTitle('New Game');
        game$ = this.gameService.getCurrentGameId()
          .pipe(
            first(),
            flatMap((id: string) => this.gameService.getGameById(id)),
            map((game: Game) => {
              game.id = UUID.UUID();
              game.isGameContinuing = false;
              game.firstPlayerList = [];
              return game;
            })
          );
      }

      combineLatest(
        game$.pipe(
          flatMap((game: Game) => {
            this.game = Object.assign({}, game);
            return forkJoin(
              this.gameCategoryService.getGameCategoryById(this.game.gameCategory.id),
              this.playerService.getPlayerListById(this.game.scoreList.map((score: Score) => score.playerId))
            );
          })
        ),
        this.playerService.getPlayerList(),
        this.gameCategoryService.getGameCategoryList()
      ).subscribe(
        ([[gameCategory, gamePlayerList], playerList, gameCategoryList]: [[GameCategory, Player[]], Player[], GameCategory[]]) => {
          this.playerList = playerList;
          this.gameCategoryList = gameCategoryList;
          this.chosenGameCategory = this.gameCategoryList.find((category: GameCategory) => category.id === gameCategory.id);
          gamePlayerList.forEach((player: Player) => this.gamePlayerList.push(Object.assign({}, player)));
          this.filterPlayerList();
        }
      );
    } else {
      this.mainBarService.setTitle('New Game');
      this.game = new Game();
      this.game.id = UUID.UUID();
      this.game.isGameContinuing = false;
      this.game.firstPlayerList = [];
      this.chosenGameCategory = new GameCategory();

      this.playerService.getPlayerList()
        .subscribe((playerList: Player[]) => {
          this.playerList = playerList;
        });

      this.gameCategoryService.getGameCategoryList()
        .subscribe((gameCategoryList: GameCategory[]) => {
          this.gameCategoryList = gameCategoryList;
        });
    }
  }

  @HostListener('dragenter', ['$event'])
  public dragEnter(event: any): void {
    event.preventDefault();
  }

  public onNewPlayerOut(event: FocusEvent | KeyboardEvent, input: HTMLInputElement) {
    let player: Player;
    let shouldAddPlayer = false;

    if (input.value) {
      if (event instanceof FocusEvent && (!event.relatedTarget || event.relatedTarget['tagName'] !== 'MAT-OPTION')) {
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

  public addPlayer(newPlayer: Player, input: HTMLInputElement) {
    const player = Object.assign({}, newPlayer);
    input.value = '';
    this.gamePlayerList.push(player);

    if (!this.isCreationMode
      && !this.game.scoreList.find((score: Score) => score.playerId === player.id)
      && isNullOrUndefined(this.newPlayerScore)
    ) {
      this.openNewPlayerScoreDialog();
    }

    this.newPlayerName = '';
    this.filterPlayerList();
  }

  public changePlayer(oldPlayer: Player, player: Player | string) {
    if (player) {
      if (typeof player === 'string') {
        const newPlayer: Player = this.playerList.find((pl: Player) => pl.name === player);

        if (newPlayer) {
          oldPlayer.id = newPlayer.id;
          oldPlayer.name = newPlayer.name;
        } else {
          oldPlayer.id = UUID.UUID();
          oldPlayer.name = player;
        }
      } else {
        oldPlayer.id = player.id;
        oldPlayer.name = player.name;
      }

      if (!this.isCreationMode
        && !this.game.scoreList.find((score: Score) => score.playerId === oldPlayer.id)
        && isNullOrUndefined(this.newPlayerScore)
      ) {
        this.openNewPlayerScoreDialog();
      }
    } else {
      this.gamePlayerList.splice(this.gamePlayerList.indexOf(oldPlayer), 1);
    }

    this.filterPlayerList();
  }

  public removePlayer(player: Player) {
    this.gamePlayerList.splice(this.gamePlayerList.indexOf(player), 1);
    this.filterPlayerList();
  }

  public filterPlayerList(name?: string) {
    const filteredValue = name && typeof name === 'string' ? name.toLowerCase() : '';
    this.filteredPlayerList = this.playerList.filter(
      (player: Player) => !this.gamePlayerList.find((pl: Player) => pl.name === player.name)
        && player.name.toLowerCase().includes(filteredValue)
      );
  }

  public onSelectGameCategory(gameCategory: GameCategory) {
    this.game.gameCategory = Object.assign({}, gameCategory);
  }

  public openCategoryDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gameCategoryService.getGameCategoryList()
          .subscribe((gameCategoryList: GameCategory[]) => {
            this.gameCategoryList = gameCategoryList;
            this.chosenGameCategory = this.gameCategoryList.find((gameCategory: GameCategory) => gameCategory.id === result.id);
            this.onSelectGameCategory(this.chosenGameCategory);
          });
      }
    });
  }

  public startGame() {
    if (this.gamePlayerList.length && this.chosenGameCategory) {
      this.game.date = this.isCreationMode ? new Date() : this.game.date;
      this.game.scoreList = this.isCreationMode ? [] : this.game.scoreList;

      const newPlayerList: Player[] = [];
      const newScoreList: Score[] = [];
      const voidRoundScoreList: number[] = [];

      for (const player of this.gamePlayerList) {
        newScoreList.push({
          playerId: player.id,
          roundScoreList: [0],
          total: 0
        });

        if (!this.isCreationMode) {
          const playerScore: Score = this.game.scoreList.find((score: Score) => score.playerId === player.id);
          if (playerScore) {
            newScoreList[newScoreList.length - 1].roundScoreList = playerScore.roundScoreList;
            newScoreList[newScoreList.length - 1].total = playerScore.total;
          } else {
            if (!voidRoundScoreList.length) {
              for (let i = 0; i < this.game.scoreList[0].roundScoreList.length; i++) {
                if (i === 1 && !isNullOrUndefined(this.newPlayerScore)) {
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

      (newPlayerList.length ? this.playerService.createPlayerList(newPlayerList) : of(null))
        .pipe(
          flatMap(() => this.isCreationMode ? this.gameService.createGame(this.game) : this.gameService.updateGame(this.game))
        )
        .subscribe(() => this.router.navigate(['/current-game/' + this.game.id]));
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
