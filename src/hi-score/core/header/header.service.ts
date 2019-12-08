import { Injectable } from '@angular/core';

/**
 * Service to handle main bar actions
 *
 * @export
 * @class HeaderService
 */
@Injectable()
export class HeaderService {
  /**
   * Title showed in the main bar
   *
   * @public
   * @type {string}
   * @memberof MainBarService
   */
  public title: string;

  /**
   * Specify if the main bar is on the left side of the screen
   *
   * @public
   * @type {boolean}
   * @memberof MainBarService
   */
  public isLeftSide = false;
}
