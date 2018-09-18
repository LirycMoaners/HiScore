import { Injectable } from '@angular/core';

/**
 * Service to handle main bar actions
 *
 * @export
 * @class MainBarService
 */
@Injectable()
export class MainBarService {
  /**
   * Title showed in the main bar
   *
   * @public
   * @type {string}
   * @memberof MainBarService
   */
  public title: string;

  /**
   * Specify if the menu is on the left side of the screen
   *
   * @public
   * @type {boolean}
   * @memberof MainBarService
   */
  public isLeftSide = false;

  /**
   * Specify if the option menu is visible in the main bar
   *
   * @public
   * @type {boolean}
   * @memberof MainBarService
   */
  public isOptionMenuVisible = false;
}
