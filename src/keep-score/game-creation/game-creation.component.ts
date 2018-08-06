import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { Player } from '../shared/player/player.model';
import { PlayerService } from '../shared/player/player.service';
import { GameCategory } from '../shared/game-category/game-category.model';
import { GameCategoryService } from '../shared/game-category/game-category.service';
import { Game } from '../shared/game/game.model';
import { UUID } from 'angular2-uuid';
import { GameService } from '../shared/game/game.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'ks-game-creation',
  templateUrl: 'game-creation.component.html',
  styleUrls: ['game-creation.component.scss']
})

export class GameCreationComponent implements OnInit {
  public playerList: Player[] = [];
  public gamePlayerList: Player[] = [];
  public gameCategoryList: GameCategory[] = [];
  public addedPlayer: Player = {id: '0', name: ''};
  public chosenGameCategory: GameCategory;

  constructor(
    private mainBarService: MainBarService,
    private playerService: PlayerService,
    private gameCategoryService: GameCategoryService,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.mainBarService.setTitle('New Game');
    this.playerService.getPlayerList()
      .subscribe((playerList: Player[]) => this.playerList = playerList);
    this.gameCategoryService.getGameCategoryList()
      .subscribe((gameCategoryList: GameCategory[]) => this.gameCategoryList = gameCategoryList);
  }

  public addPlayer(): void {
    if (this.addedPlayer.id) {
      this.gamePlayerList.push(this.addedPlayer);
      this.addedPlayer = {id: '0', name: ''};
    }
  }

  public startGame() {
    if (this.gamePlayerList.length && this.chosenGameCategory) {
      const game = new Game();
      game.id = UUID.UUID();
      game.gameCategory = this.chosenGameCategory;
      game.scoreList = [];
      for (const player of this.gamePlayerList) {
        game.scoreList.push({
          playerId: player.id,
          roundScoreList: [0],
          total: 0
        });
      }
      this.gameService.createGame(game).subscribe((createdGame: Game) => this.router.navigate(['/current-game/' + createdGame.id]));
    }
  }
}
