import { Component, OnInit } from '@angular/core';
import { Game } from '../shared/game/game.model';
import { GameService } from '../shared/game/game.service';
import { MainBarService } from '../shared/main-bar/main-bar.service';

/**
 * Component showing the list of every game
 *
 * @export
 * @class GameListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'hs-game-list',
  templateUrl: 'game-list.component.html',
  styleUrls: ['game-list.component.scss']
})
export class GameListComponent implements OnInit {
  /**
   * Complete game list
   *
   * @type {Game[]}
   * @memberof GameListComponent
   */
  public gameList: Game[] = [];
  /**
   * Today's date
   *
   * @type {Date}
   * @memberof GameListComponent
   */
  public today: Date = new Date();

  constructor(
    private gameService: GameService,
    private mainBarService: MainBarService
  ) { }

  ngOnInit() {
    this.mainBarService.title = 'Game List';
    this.gameService.getGameList().subscribe((gameList: Game[]) => this.gameList = gameList);
  }
}
