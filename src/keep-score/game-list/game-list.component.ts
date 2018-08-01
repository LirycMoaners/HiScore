import { Component, OnInit } from '@angular/core';
import { Game } from '../shared/game/game.model';
import { GameService } from '../shared/game/game.service';

@Component({
  selector: 'ks-game-list',
  templateUrl: 'game-list.component.html',
  styleUrls: ['game-list.component.scss']
})

export class GameListComponent implements OnInit {
  public gameList: Game[] = [];

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.gameService.getGameList().subscribe((gameList: Game[]) => this.gameList = gameList);
  }
}
