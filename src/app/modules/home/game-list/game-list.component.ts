import { Component, OnInit } from '@angular/core';

import { Game } from '../../../shared/models/game.model';
import { GameService } from '../../../core/http-services/game.service';
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
  public gameList: {date: Date, games: Game[]}[];

  /**
   * Today's date
   */
  public today: Date = new Date();

  constructor(
    private readonly gameService: GameService,
    private readonly headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.title = 'Game List';
    this.gameService.elementListSubject.subscribe((gameList: Game[]) => {
      this.gameList = [];
      for (const game of gameList) {
        const indexSameMonth = this.gameList.findIndex(gamesInMonth =>
          gamesInMonth.games[0].date.getMonth() === game.date.getMonth()
          && gamesInMonth.games[0].date.getFullYear() === game.date.getFullYear()
        );
        if (indexSameMonth >= 0) {
          this.gameList[indexSameMonth].games.push(game);
        } else {
          this.gameList.push({ date: game.date, games: [game] });
        }
      }
    });
  }
}
