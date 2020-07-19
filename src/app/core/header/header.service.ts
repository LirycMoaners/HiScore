import { Injectable, EventEmitter } from '@angular/core';

/**
 * Service to handle main bar actions
 *
 * @export
 */
@Injectable()
export class HeaderService {

  /**
   * Title showed in the main bar
   */
  public title = '';

  /**
   * Specify if the main bar is on the left side of the screen
   */
  public isLeftSide = false;

  /**
   * Specify if the menu is open
   */
  public toggleMenu: EventEmitter<void> = new EventEmitter<void>();
}
