import { Component } from '@angular/core';

import { GameService } from '../../http-services/game.service';
import { OptionMenuService } from './option-menu.service';
import { HeaderService } from '../header.service';

/**
 * Component of the option menu
 *
 * @export
 */
@Component({
  selector: 'app-option-menu',
  templateUrl: 'option-menu.component.html',
  styleUrls: ['option-menu.component.scss']
})
export class OptionMenuComponent {

  constructor(
    public gameService: GameService,
    public headerService: HeaderService,
    private readonly optionMenuService: OptionMenuService
  ) { }

  /**
   * Emit that we want to edit the last round
   */
  public editLastRound() {
    this.optionMenuService.editLastRound$.next();
  }

  /**
   * Emit that we want to end the game
   */
  public endGame() {
    this.optionMenuService.endGame$.next();
  }
}
