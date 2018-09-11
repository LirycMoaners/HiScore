import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../main-bar/main-bar.service';
import { OptionMenuService } from './option-menu.service';
import { GameService } from '../game/game.service';

/**
 * Component of the option menu
 *
 * @export
 * @class OptionMenuComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'hs-option-menu',
  templateUrl: 'option-menu.component.html',
  styleUrls: ['option-menu.component.scss']
})
export class OptionMenuComponent implements OnInit {
  /**
   * Specifiy if the icon is horizontal or not
   *
   * @type {boolean}
   * @memberof OptionMenuComponent
   */
  public isHoriz: boolean;

  /**
   * The current game id needded for the game edition navigation
   *
   * @type {string}
   * @memberof OptionMenuComponent
   */
  public currentGameId: string;

  constructor(
    private mainBarService: MainBarService,
    private gameService: GameService,
    private optionMenuService: OptionMenuService
  ) { }

  ngOnInit() {
    this.mainBarService.getIsLeftSide().subscribe(
      (isLeftSide: boolean) => this.isHoriz = isLeftSide
    );

    this.gameService.getCurrentGameId().subscribe(
      (currentGameId: string) => this.currentGameId = currentGameId
    );
  }

  /**
   * Emit that we want to edit the last round
   *
   * @memberof OptionMenuComponent
   */
  public editLastRound() {
    this.optionMenuService.setEditLastRound();
  }

  /**
   * Emit that we want to create a new game
   *
   * @memberof OptionMenuComponent
   */
  public newGame() {
    this.optionMenuService.setNewGame();
  }

  /**
   * Emit that we want to end the game
   *
   * @memberof OptionMenuComponent
   */
  public endGame() {
    this.optionMenuService.setEndGame();
  }
}
