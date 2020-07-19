import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { GameService } from '../../http-services/game.service';
import { OptionMenuService } from './option-menu.service';
import { HeaderService } from '../header.service';
import { UserService } from '../../http-services/user.service';
import { Game } from '../../../shared/models/game.model';

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
export class OptionMenuComponent implements OnInit {

  /**
   * The currently played game
   */
  public currentGame!: Game;

  /**
   * Indicates if the user can modify the game
   */
  public canEditGame = false;

  constructor(
    public gameService: GameService,
    public headerService: HeaderService,
    private readonly optionMenuService: OptionMenuService,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    this.gameService.currentGame.pipe(first()).subscribe(game => {
      this.currentGame = game;
      this.canEditGame = this.gameService.getCanEditGame(game, this.userService.user);
    });
  }

  /**
   * Emit that we want to edit the last round
   */
  public editLastRound(): void {
    this.optionMenuService.editLastRound$.next();
  }

  /**
   * Emit that we want to end the game
   */
  public endGame(): void {
    this.optionMenuService.endGame$.next();
  }
}
