import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { Player } from '../shared/player/player.model';
import { PlayerService } from '../shared/player/player.service';
import { GameCategory } from '../shared/game-category/game-category.model';
import { GameCategoryService } from '../shared/game-category/game-category.service';
import { Game } from '../shared/game/game.model';
import { UUID } from 'angular2-uuid';
import { GameService } from '../shared/game/game.service';
import { Router } from '@angular/router';
import { Observable, forkJoin, empty, of } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'ks-game-creation',
  templateUrl: 'game-creation.component.html',
  styleUrls: ['game-creation.component.scss']
})

export class GameCreationComponent implements OnInit {
  public selectablePlayerList: Player[] = [];
  public playerList: Player[] = [];
  public gamePlayerList: Player[] = [];
  public gameCategoryList: GameCategory[] = [];
  public chosenGameCategory: GameCategory = new GameCategory();
  public isShownAddCategoryPopup = false;

  constructor(
    private mainBarService: MainBarService,
    private playerService: PlayerService,
    private gameCategoryService: GameCategoryService,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.mainBarService.setTitle('New Game');

    this.chosenGameCategory.name = '';

    this.playerService.getPlayerList()
      .subscribe((playerList: Player[]) => {
        this.playerList = playerList;
        this.selectablePlayerList = playerList;
      });

    this.gameCategoryService.getGameCategoryList()
      .subscribe((gameCategoryList: GameCategory[]) => this.gameCategoryList = gameCategoryList);
  }

  public addPlayer(event: any): void {
    const name: string = event.target.value;
    if (name) {
      const findedPlayer: Player = this.playerList.find((player: Player) => player.name === name);

      if (findedPlayer) {
        this.gamePlayerList.push(Object.assign({}, findedPlayer));
      } else {
        const newPlayer = new Player();
        newPlayer.id = UUID.UUID();
        newPlayer.name = name;
        this.gamePlayerList.push(newPlayer);
      }

      this.refreshSelectablePlayerList();
    }
    event.target.value = '';
  }

  public changePlayer(oldPlayer: Player, newName: string) {
    if (newName) {
      const findedPlayer: Player = this.playerList.find((player: Player) => player.name === newName);

      if (findedPlayer) {
        oldPlayer.id = findedPlayer.id;
        oldPlayer.name = findedPlayer.name;
      } else {
        oldPlayer.id = UUID.UUID();
        oldPlayer.name = newName;
      }
    } else {
      this.gamePlayerList.splice(this.gamePlayerList.indexOf(oldPlayer), 1);
    }

    this.refreshSelectablePlayerList();
  }

  public startGame() {
    if (this.gamePlayerList.length && this.chosenGameCategory) {
      const game = new Game();
      game.id = UUID.UUID();
      game.gameCategory = this.chosenGameCategory;
      game.date = new Date();
      game.scoreList = [];

      const newPlayerList$: Observable<Player>[] = [];

      for (const player of this.gamePlayerList) {
        game.scoreList.push({
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
          flatMap(() => this.gameService.createGame(game))
        )
        .subscribe((createdGame: Game) => this.router.navigate(['/current-game/' + createdGame.id]));
    }
  }

  public switchVisibilityAddCategoryPopup() {
    this.isShownAddCategoryPopup = !this.isShownAddCategoryPopup;
  }

  public selectGameCategory(gameCategory: GameCategory) {
    this.chosenGameCategory = gameCategory;
    this.switchVisibilityAddCategoryPopup();
  }

  private refreshSelectablePlayerList() {
    this.selectablePlayerList = this.playerList.filter((player: Player) => !this.gamePlayerList.find((pl: Player) => pl.id === player.id));
  }
}
