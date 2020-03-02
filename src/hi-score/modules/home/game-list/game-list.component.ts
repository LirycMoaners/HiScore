import { Component, OnInit } from '@angular/core';
import { Game } from '../../../shared/models/game.model';
import { GameService } from '../../../core/services/game.service';
import { HeaderService } from '../../../core/header/header.service';

/**
 * Component showing the list of every game
 *
 * @export
 */
@Component({
  selector: 'app-game-list',
  templateUrl: 'game-list.component.html',
  styleUrls: ['game-list.component.scss']
})
export class GameListComponent implements OnInit {
  /**
   * Complete game list
   */
  public gameList: Game[] = [];
  /**
   * Today's date
   */
  public today: Date = new Date();

  constructor(
    private gameService: GameService,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.title = 'Game List';
    this.gameService.getGameList().subscribe((gameList: Game[]) => this.gameList = gameList);
  }
}
