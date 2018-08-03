import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';
import { Player } from '../shared/player/player.model';
import { PlayerService } from '../shared/player/player.service';

@Component({
  selector: 'ks-game-creation',
  templateUrl: 'game-creation.component.html',
  styleUrls: ['game-creation.component.scss']
})

export class GameCreationComponent implements OnInit {
  public playerList: Player[] = [];
  public gamePlayerList: Player[] = [];
  public addedPlayer: Player = {id: '0', name: ''};

  constructor(
    private mainBarService: MainBarService,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.mainBarService.setTitle('New Game');
    this.playerService.getPlayerList().subscribe((playerList: Player[]) => this.playerList = playerList);
  }

  public addPlayer(): void {
    if (this.addedPlayer.id) {
      this.gamePlayerList.push(this.addedPlayer);
      this.addedPlayer = {id: '0', name: ''};
    }
  }
}
