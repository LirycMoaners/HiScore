import { Component, OnInit, HostListener } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { Player } from '../shared/player/player.model';
import { PlayerService } from '../shared/player/player.service';
import { GameCategory } from '../shared/game-category/game-category.model';
import { GameCategoryService } from '../shared/game-category/game-category.service';
import { Game } from '../shared/game/game.model';
import { UUID } from 'angular2-uuid';
import { GameService } from '../shared/game/game.service';
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MatDialog, MatSelect } from '@angular/material';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EndingType } from '../shared/game-category/ending-type.enum';
import { Goal } from '../shared/game-category/goal.enum';

@Component({
  selector: 'hs-game-creation',
  templateUrl: 'game-creation.component.html',
  styleUrls: ['game-creation.component.scss']
})

export class GameCreationComponent implements OnInit {
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

  constructor(
    private mainBarService: MainBarService,
    private playerService: PlayerService,
    private gameCategoryService: GameCategoryService,
    private gameService: GameService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.mainBarService.setTitle('New Game');
    this.mainBarService.setIsLeftSide(false);

    this.game = new Game();
    this.game.id = UUID.UUID();
    this.game.isGameContinuing = false;
    this.game.firstPlayerList = [];
    this.game.scoreList = [];

    this.playerService.getPlayerList()
      .subscribe((playerList: Player[]) => {
        this.playerList = playerList;
        this.filteredPlayerList = playerList;
      });

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
      this.game.date = new Date();

      const newPlayerList$: Observable<Player>[] = [];

      for (const player of this.gamePlayerList) {
        this.game.scoreList.push({
          playerId: player.id,
          roundScoreList: [0],
          total: 0
        });

        if (!this.playerList.find((pl: Player) => pl.id === player.id)) {
          newPlayerList$.push(this.playerService.createPlayer(player));
        }
      }

      (newPlayerList$.length ? forkJoin(newPlayerList$) : of(null))
        .pipe(
          flatMap(() => this.gameService.createGame(this.game))
        )
        .subscribe((createdGame: Game) => this.router.navigate(['/current-game/' + createdGame.id]));
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
}
