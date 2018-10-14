import { Component } from '@angular/core';
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
  constructor(
    public router: Router,
    public gameService: GameService,
    private optionMenuService: OptionMenuService
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
   * Emit that we want to end the game
   *
   * @memberof OptionMenuComponent
   */
  public endGame() {
    this.optionMenuService.endGame$.next();
  }
}
