import { Component, OnInit } from '@angular/core';
import { Game } from '../shared/game/game.model';
import { GameService } from '../shared/game/game.service';
import { MainBarService } from '../shared/main-bar/main-bar.service';

@Component({
  selector: 'hs-game-list',
  templateUrl: 'game-list.component.html',
  styleUrls: ['game-list.component.scss']
})

export class GameListComponent implements OnInit {
  public gameList: Game[] = [];

  constructor(
    private gameService: GameService,
    private mainBarService: MainBarService
  ) { }

  ngOnInit() {
    this.mainBarService.setTitle('Game List');
    this.gameService.getGameList().subscribe((gameList: Game[]) => this.gameList = gameList);
  }
}
