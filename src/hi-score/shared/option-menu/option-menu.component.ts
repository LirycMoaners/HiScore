import { Component } from '@angular/core';
import { MainBarService } from '../main-bar/main-bar.service';
import { OptionMenuService } from './option-menu.service';
import { GameService } from '../game/game.service';
import { Router } from '@angular/router';

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
export class OptionMenuComponent {
  /**
   * The current game id needded for the game edition navigation
   *
   * @type {string}
   * @memberof OptionMenuComponent
   */
  public currentGameId: string;

  constructor(
    public mainBarService: MainBarService,
    public gameService: GameService,
    private optionMenuService: OptionMenuService,
    private router: Router
  ) { }

  /**
   * Emit that we want to edit the last round
   *
   * @memberof OptionMenuComponent
   */
  public editLastRound() {
    this.optionMenuService.editLastRound$.next();
  }

  /**
   * Emit that we want to create a new game
   *
   * @memberof OptionMenuComponent
   */
  public navigateToGameCreation() {
    this.router.navigate(['/game-creation'], {queryParams: {copy: true}});
  }

  /**
   * Emit that we want to end the game
   *
   * @memberof OptionMenuComponent
   */
  public endGame() {
    this.optionMenuService.endGame$.next();
  }
}
