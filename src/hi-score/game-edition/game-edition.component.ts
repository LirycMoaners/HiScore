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
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EndingType } from '../shared/game-category/ending-type.enum';
import { Goal } from '../shared/game-category/goal.enum';
import { Score } from '../shared/score/score.model';

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
  public isShownAddCategoryPopup = false;
  public newPlayerName = '';
  public EndingType: typeof EndingType = EndingType;
  public Goal: typeof Goal = Goal;
  public isCreationMode = true;

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
    this.mainBarService.setIsLeftSide(false);

    const gameId: string = this.route.snapshot.params['id'];
    let game$: Observable<null> = of(null);

    if (gameId) {
      this.mainBarService.setTitle('Game Edition');
      this.isCreationMode = false;

      game$ = this.gameService.getGameById(gameId)
        .pipe(
          flatMap((game: Game) => {
            this.game = Object.assign({}, game);
            return forkJoin(
              this.gameCategoryService.getGameCategoryById(this.game.gameCategory.id),
              this.playerService.getPlayerListById(this.game.scoreList.map((score: Score) => score.playerId))
            );
          }),
          flatMap(([gameCategory, playerList]: [GameCategory, Player[]]) => {
            this.chosenGameCategory = gameCategory;
            playerList.forEach((player: Player) => this.gamePlayerList.push(Object.assign({}, player)));
            return of(null);
          })
        );
    } else {
      this.mainBarService.setTitle('New Game');

      this.game = new Game();
      this.game.id = UUID.UUID();
      this.game.isGameContinuing = false;
      this.game.firstPlayerList = [];
    }

    forkJoin(
      game$,
      this.playerService.getPlayerList()
      .pipe(
        flatMap((playerList: Player[]) => {
          this.playerList = playerList;
          this.filteredPlayerList = playerList;
          return of(null);
        })
      )
    ).subscribe(() => this.filterPlayerList());

    this.gameCategoryService.getGameCategoryList()
      .subscribe((gameCategoryList: GameCategory[]) => {
        this.gameCategoryList = gameCategoryList;
      });
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
    } else {
      this.gamePlayerList.splice(this.gamePlayerList.indexOf(oldPlayer), 1);
    }

    this.filterPlayerList();
  }

  public filterPlayerList(name?: string) {
    const filteredValue = name && typeof name === 'string' ? name.toLowerCase() : '';
    this.filteredPlayerList = this.playerList.filter(
      (player: Player) => !this.gamePlayerList.find((pl: Player) => pl.name === player.name)
        && player.name.toLowerCase().includes(filteredValue)
      );
  }

  public openDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.chosenGameCategory = result || this.chosenGameCategory;
    });
  }

  public onSelectGameCategory(gameCategory: GameCategory) {
    this.game.gameCategory = Object.assign({}, gameCategory);
  }

  public startGame() {
    if (this.gamePlayerList.length && this.chosenGameCategory) {
      this.game.date = this.isCreationMode ? new Date() : this.game.date;
      this.game.scoreList = this.isCreationMode ? [] : this.game.scoreList;

      const newPlayerList$: Observable<boolean>[] = [];
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
                voidRoundScoreList.push(0);
              }
            }
            newScoreList[newScoreList.length - 1].roundScoreList = voidRoundScoreList;
          }
        }

        if (!this.playerList.find((pl: Player) => pl.id === player.id)) {
          newPlayerList$.push(this.playerService.createPlayer(player));
        }
      }

      this.game.scoreList = newScoreList;

      if (!this.isCreationMode) {
        this.refreshBestScore();
      }

      (newPlayerList$.length ? forkJoin(newPlayerList$) : of(null))
        .pipe(
          flatMap(() => this.isCreationMode ? this.gameService.createGame(this.game) : this.gameService.updateGame(this.game))
        )
        .subscribe(() => this.router.navigate(['/current-game/' + this.game.id]));
    }
  }

  public addPlayer(newPlayer: Player, input: HTMLInputElement) {
    const player = Object.assign({}, newPlayer);
    input.value = '';
    this.gamePlayerList.push(player);

    this.newPlayerName = '';
    this.filterPlayerList();
  }

  public removePlayer(player: Player) {
    this.gamePlayerList.splice(this.gamePlayerList.indexOf(player), 1);
    this.filterPlayerList();
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
}
